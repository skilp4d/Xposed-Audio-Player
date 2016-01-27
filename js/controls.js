var gui = require('nw.gui');
var win = gui.Window.get();

$(document).ready(function(){

  // Setting global values
  globals.body = $('body');
  globals.songsQueue = giveQueue();
  globals.svgicon = [];
  var batFiles = globals.batFiles;
  var svgicon;
  var DOM_toolbar = $(".toolbar");
  var DOM_navCenter = $(".navcenter");
  var DOM_songsList = $(".songsList");
  var DOM_searchResults = $(".searchResults");
  $('.songsList').css({
    "height": globals.body.height()-105 +"px"
  });
  vol.get(function (err,level) {
    lev = level*100;
    $("#volumeBar").prop("value",lev);
  });


  // Set background as soon as the app starts
  setBackground(globals.albumArts + "default.png");
  //Play pause functionality
  $("#play").click(function(){
    globals.weChanged = true;
    //console.log(batFiles.Root + "" + batFiles.PlayPause);
    process.execFile(batFiles.Root + "" + batFiles.PlayPause,function(err){
      //console.log(err);
      if(err){
        globals.svgicon[1].toPlayMode(svgIconConfig);
      }
    });
    //globals.svgicon[1].toStopMode(svgIconConfig);
  });

  //Next song functionality
  $("#next").click(function(){
    globals.count--;
    //globals.weChanged = true;
    process.execFile(batFiles.Root + "" + batFiles.Next,function(err){
      //console.log(err);
      if(err){
        globals.svgicon[1].toPlayMode(svgIconConfig);
      }
    });

  });

  //Previous song functionality
  $("#previous").click(function(){
    globals.weChanged = true;
    globals.count++;
    process.execFile(batFiles.Root + "" + batFiles.Prev,function(err){
      //console.log(err);
      if(err){
        globals.svgicon[1].toPlayMode(svgIconConfig);
      }
    });
    globals.svgicon[1].toStopMode(svgIconConfig);
  });

  // adding data-updown attr to .navcenter . This is required for initialization of dropdown functionality
  DOM_navCenter.attr("data-updown","up");

  //Drop down functionality
  $("#listarrow").click(function(){
    var curr = DOM_navCenter;
    var songslist = DOM_songsList;
    if(curr.attr("data-updown") === "up"){
        var songlist = globals.songsQueue;
        //renderList($("#nowPlayingList"),songlist);
        curr.attr("data-updown","down");
        var height = $('body').height() - 75;
        curr.animate({ height: height + 'px' }, 700, 'easeOutBounce');
        //TweenLite.to(curr, 1, {height: height + 'px', ease:Bounce.easeOut});
        songslist.css({height: height - 32 + "px", display: "block"});
        DOM_toolbar.addClass("darkcolor");
        //curr.addClass("blurry");
    }else{
        curr.attr("data-updown","up");
        curr.animate({ height: '32px' }, 200, 'easeOutCubic');
        //curr.removeClass("blurry");
        DOM_toolbar.removeClass("darkcolor");
        songslist.css({display: "none"});
    }
    globals.svgicon[0].toggle(svgIconConfig);

    if($("#allSongsList").attr("data-rendered") === "nope"){
      console.log("rendering all songs");
      renderAllSongs($("#allSongsList"));
      $("#allSongsList").attr("data-rendered","yep");
    }
  });


  //Display the all songs Playlist
  $("#allSongsButton").click(function () {
    $("#playlists").animate({"left":"100%"},200,'linear').hide(0);
    $("#allSongsList").show(0).animate({"left":"0px"},200,'linear');
  });

  //Display the all songs Playlist
  $("#playlistButton").click(function () {
    $("#allSongsList").animate({"left":"-100%"},200,'linear').hide(0);
    $("#playlists").show(0).animate({"left":"0px"},200,'linear');
  });



  // Settings animation and functionality
  $("#settings").click(function () {
    $(".settingItem").toggleClass("dummy--active");
    $(".settingList").toggleClass("settingListToggle");
  });


  // Add Music functionality
  $("#addMusic").click(function () {
    var chooser = $("#folderSelect");
    chooser.unbind('change');
    chooser.change(function(evt) {
      // add the meta data of the songs in this folder ;
      walk(chooser.val(), function(err, results) {
        //console.log(results);
        if (err) throw err;
        var file = results;
        var curfile;
        var DOM_allSongsList = $("#allSongsList");

        var callbackfn = function(err,result){
          if (!err){
            //console.log(file[itr]);
            //console.log("callback");
            var tosave = {
              title: result.title,
              artist: result.artist,
              albumartist: result.albumartist,
              album : result.album,
              year: result.year,
              genre: result.genre
            };
            if(result.picture.length > 0){
              var savedImgName;
              if(result.album.length > 0){
                tosave.imageUrl = globals.albumArts + result.album + "." +  result.picture[0].format;
                savedImgName = result.album + "." +  result.picture[0].format;
              }else if(result.title.length > 0){
                tosave.imageUrl = globals.albumArts + result.title + "." +  result.picture[0].format;
                savedImgName = result.title + "." +  result.picture[0].format;
              }else{
                var name = curfile.split("\\").pop();
                tosave.imageUrl = globals.albumArts + name.substr(0,name.length - 4) + "." +  result.picture[0].format;
                savedImgName = name.substr(0,name.length - 4) + "." +  result.picture[0].format;
              }

              // Save the album art iff the album art doesnt exist already
              if(globals.albumArtsArr.indexOf(savedImgName) == -1){
                if (result.picture.length > 0) {
                  var picture = result.picture[0];
                  var databuffer = new Buffer(picture.data);
                  fs.writeFile(globals.albumArts + savedImgName, databuffer,function (err) {
                      console.log(err);
                  });
                }
              }

            }else{
              tosave.imageUrl = globals.albumArts + "default.png";
            }
            globals.songslist[curfile] = tosave;
            addAllSongsItem(DOM_allSongsList,tosave, curfile);
            var batFiles = globals.batFiles;
          }
          // calling the function again if files are left;
          if(file.length > 0){
            curfile = file.pop();
            while(globals.songslist[curfile] && file.length > 0){
              //console.log(curfile);
              curfile = file.pop();
            }
            //console.log("now exec " + curfile);
            mmd(fs.createReadStream(curfile),callbackfn);
          }
        };
        curfile = file.pop();
        while(globals.songslist[curfile] && file.length > 0){
          //console.log(curfile);
          curfile = file.pop();
        }
        //console.log("now exec " + curfile);
        mmd(fs.createReadStream(curfile),callbackfn);
      });

    });
    chooser.trigger('click');
  });


  // Search functionality
  $("#search").keyup(function(event){
    if(event.keyCode == 13){
        var searchKey = $(this).val();
        var titles = [];
        var artists = {};
        var albums = {};
        var numArtists = 0;
        var numAlbums = 0;

        Object.keys(globals.songslist).forEach(function (key) {
          var temp = globals.songslist[key];
          var title = temp.title;
          var artist = temp.artist[0];
          var album = temp.album;

          if(title.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0){
            // searchKey found in the title of current song
            // add the address of the song to the array
            titles.push(key);
          }
          if(artist){
            if(artist.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0){
              // searchKey found in the artist of current song
              // add the address of the song to the array
              if(!artists[artist]){
                numArtists++;
                artists[artist] = 1;
              }else{
                artists[artist]++;
              }
            }
          }
          if(album){
            if(album.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0){
              // searchKey found in the album of current song
              // add the address of the song to the array
              if(!albums[album]){
                numAlbums++;
                albums[album] = 1;
              }else{
                albums[album]++;
              }
            }
          }

        });
        //console.log(titles);
        //console.log(albums);
        //console.log(artists);
        DOM_searchResults.show();
        DOM_searchResults.html("");
        if(titles.length > 0){
          renderSearchSongs(DOM_searchResults, titles, "Songs");
        }
        if(numAlbums > 0){
          renderSearchAlbums(DOM_searchResults, albums, "Albums");
        }
        if(numArtists > 0){
          renderSearchArtists(DOM_searchResults, artists, "Artists");
        }

        if((titles.length + numAlbums + numArtists) <= 0 ){
          DOM_searchResults.append("<h2 class='searchListHeading'>"+ "No Search Results" + "</h2>");
        }
    }
  });

  $("body > div:not(.searchResults)").click(function(e) {
    DOM_searchResults.hide();
    $("#search").val("");
  });

  // Binding the click handlers for search results
  DOM_searchResults.on('click','.searchItemSong',function () {
    var name = $(this).attr("data-name");
    process.exec('"' + globals.batFiles.Root + globals.batFiles.Start + '" "' + name + '"');
    DOM_searchResults.hide();
    $("#search").val("");
  });


  DOM_searchResults.on('click','.searchItemArtist',function () {
    DOM_searchResults.hide();
    $("#search").val("");
    var name = $(this).attr("data-name");
    var songs = [];
    Object.keys(globals.songslist).forEach(function (key) {
      var temp = globals.songslist[key];
      var artist = temp.artist[0];
      if(artist){
        if(artist.toLowerCase().indexOf(name.toLowerCase()) >= 0){
          // searchKey found in the artist of current song
          // add the address of the song to the array
          songs.push(key);
        }
      }
    });

    var currPosString = [255,254,35,0,32,0,83,0,116,0,101,0,97,0,108,0,116,0,104,0,65,0,117,0,100,0,105,0,111,0,80,0,108,0,97,0,121,0,101,0,114,0,32,0,99,0,117,0,114,0,114,0,101,0,110,0,116,0,32,0,116,0,114,0,97,0,99,0,107,0,32,0,112,0,111,0,115,0,105,0,116,0,105,0,111,0,110,0,32,0,97,0,116,0,32,0,48,0,13,0,10,0];
    var origbuf = new Buffer(currPosString);
    var bufArr = [origbuf];
    for(var i=0 ; i<songs.length ; i++){
      bufArr.push(nameToBuf(songs[i]));
    }
    var finaldata = Buffer.concat(bufArr);
    //console.log(dataa);


    //console.log(dataa);
    process.execFileSync(batFiles.Root + "" + batFiles.Stop);
    fs.writeFile(batFiles.Root + "" + batFiles.M3U, finaldata ,{encoding:null}, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!');
        process.execFile(batFiles.Root + "" + batFiles.PlayPause,function(err){
          //console.log(err);
          if(err){
            globals.svgicon[1].toPlayMode(svgIconConfig);
          }
        });
    });
  });


  DOM_searchResults.on('click','.searchItemAlbum',function () {
    DOM_searchResults.hide();
    $("#search").val("");
    var name = $(this).attr("data-name");
    var songs = [];
    Object.keys(globals.songslist).forEach(function (key) {
      var temp = globals.songslist[key];
      var album = temp.album;
      if(album){
        if(album.toLowerCase().indexOf(name.toLowerCase()) >= 0){
          // searchKey found in the artist of current song
          // add the address of the song to the array
          songs.push(key);
        }
      }
    });

    var currPosString = [255,254,35,0,32,0,83,0,116,0,101,0,97,0,108,0,116,0,104,0,65,0,117,0,100,0,105,0,111,0,80,0,108,0,97,0,121,0,101,0,114,0,32,0,99,0,117,0,114,0,114,0,101,0,110,0,116,0,32,0,116,0,114,0,97,0,99,0,107,0,32,0,112,0,111,0,115,0,105,0,116,0,105,0,111,0,110,0,32,0,97,0,116,0,32,0,48,0,13,0,10,0];
    var origbuf = new Buffer(currPosString);
    var bufArr = [origbuf];
    for(var i=0 ; i<songs.length ; i++){
      bufArr.push(nameToBuf(songs[i]));
    }
    var finaldata = Buffer.concat(bufArr);
    //console.log(dataa);


    //console.log(dataa);
    process.execFileSync(batFiles.Root + "" + batFiles.Stop);
    fs.writeFile(batFiles.Root + "" + batFiles.M3U, finaldata ,{encoding:null}, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!');
        process.execFile(batFiles.Root + "" + batFiles.PlayPause,function(err){
          //console.log(err);
          if(err){
            globals.svgicon[1].toPlayMode(svgIconConfig);
          }
        });
    });
  });





  // Minimize window functionality
  $("#minimize").click(function(){
    win.minimize();
  });

  // Close window functionality
  $("#close").click(function(){
    win.close();
  });

  win.on('close',function(){
    this.hide();
    process.execFile(batFiles.Root + "" + batFiles.Stop,function(err){
      //console.log(err);
    });

    var currPosString = [255,254,35,0,32,0,83,0,116,0,101,0,97,0,108,0,116,0,104,0,65,0,117,0,100,0,105,0,111,0,80,0,108,0,97,0,121,0,101,0,114,0,32,0,99,0,117,0,114,0,114,0,101,0,110,0,116,0,32,0,116,0,114,0,97,0,99,0,107,0,32,0,112,0,111,0,115,0,105,0,116,0,105,0,111,0,110,0,32,0,97,0,116,0,32,0,48,0,13,0,10,0];
    var origbuf = new Buffer(currPosString);
    var songBuf = nameToBuf(giveQueue()[0]);
    var totalLen = origbuf.length + songBuf.length;
    var finaldata = Buffer.concat([origbuf,songBuf], totalLen);
    //console.log(dataa);


    //console.log(dataa);
    fs.writeFile(batFiles.Root + "" + batFiles.M3U, finaldata ,{encoding:null}, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!');
    });


    var metaText = JSON.stringify(globals.songslist);
    fs.writeFile(globals.Root + "metadata.json" ,metaText,function(err){
      //console.log(err);
    });

    var playlistMeta = JSON.stringify(globals.playlists);
    fs.writeFile(globals.Root + "playlists.json" , playlistMeta,function(err){
      //console.log(err);
    });


    //localStorage["globals"] = JSON.stringify({});
    localStorage.Root = globals.Root;
    this.close(true);
  });


  //Next and prev animation
  $(".cbutton").on('click',function(){
    $(this).addClass("cbutton--click");
  });
  $(".cbutton").bind('webkitAnimationEnd',function(){
      $(this).removeClass("cbutton--click");
  });

  // Play pause animation
  $(".si-icons-default > .si-icon").each(function(index,elem){
    globals.svgicon[index] = new svgIcon( elem, svgIconConfig );
  });

  //functionality for playing song from the dropdown queue
  DOM_navCenter.on('dblclick','.songQueueItem',function(){
    var ind = parseInt($(this).attr("data-index"));
    //console.log("ind " + ind);
    var songnames =  [];
    $('.songQueueItem').each(function(i,obj){
      //console.log("all " + $(obj).attr("data-index"));
      if( $(obj).attr("data-index") >= ind){
        //console.log($(obj).attr("data-index"));
        songnames.push($(obj).attr("data-name"));
      }
    });
    //console.log(songnames);
    globals.songsQueue = songnames;
    //var songlist = globals.songsQueue;
    updateMusicFileAndPlay(songnames);
    globals.svgicon[1].toStopMode(svgIconConfig);
  });

  //functionality for adding a song from all songs to the queue
  DOM_navCenter.on('dblclick','.allSongsItem',function(){
    var name = $(this).attr("data-name");
    // Playing the song
    process.exec('"' + globals.batFiles.Root + globals.batFiles.Start + '" "' + name + '"');
  });

  DOM_navCenter.on('contextmenu','.allSongsItem',function(event){
    event.preventDefault();
    var body = $("body");
    //console.log(event);
    var name = $(this).attr("data-name");
    var temp = $("#rightClkBox");
    var left = event.clientX;
    var top = event.clientY;
    if((left + 160) > body.width()){
      left = left - 170;
    } else{
      left += 10;
    }
    if((top + temp.height()) >= body.height()-75){
      top = body.height() - temp.height() - 80;
    }else if(top >= 92){
      top = top - 20;
    }
    temp.css({
      left:left + "px",
      top: top + "px"
    });
    temp.fadeIn(400);
    globals.curCtxt = name;
  });

  $("#playFMcontext").click(function () {
    //console.log(name);
    process.exec('"' + globals.batFiles.Root + globals.batFiles.Start + '" "' + globals.curCtxt + '"');
    $("#rightClkBox").hide();
  });

  $("#ctxtplaylists").on('click','li',function (e) {
    //console.log(e);
    var plname = $(this).attr("data-name");
    var pls = globals.playlists[plname];
    if(pls){
      pls.push(globals.curCtxt);
      globals.playlists[plname] = pls;
      $(".playlistItem").each(function (j,data) {
        if($(data).attr("data-name")==plname){
          var temp = $(data).children("ul");
          var tempp = "";
          if(pls.length === 0){
            tempp = "<li>No songs Yet</li>";
          }
          for(var i=0 ; i<pls.length; i++){
            var key = pls[i];
            var meta = globals.songslist[ key ];
            var title = meta.title;
            tempp+= '<li data-name="'+ pls[i] +'">' + title + '</li>';
          }
          temp.html(tempp);
        }
      });
    }
    $("#rightClkBox").hide();
  });


  $("body > div:not(#rightClkBox)").click(function(e) {
    $("#rightClkBox").fadeOut(200);
  });


  // Volume settings
  $("#volumeBar").on("input",function () {
    var level = parseInt($(this).prop("value"));
    level/=100;
    //console.log(level);
    vol.set(level, function (err) {
	     //console.log(err);
    });
  });


  // Playlists
  $("#createPL").click(function () {
    //alert("bitch");
    var temp = $("#newPlaylist");
    var name = temp.val();
    if(name.length > 0){
      createPlaylist(name);
    }
    temp.val("");
  });

  $("#newPlaylist").keyup(function(event){
    if(event.keyCode == 13){
      var temp = $(this);
      var name = temp.val();
      if(name.length > 0){
        createPlaylist(name);
      }
      temp.val("");
    }
  });

  DOM_navCenter.on('click',".playlistAccord",function () {
    var temp = $(this).parent().siblings("ul");
    temp.toggle(200);
    $(this).toggleClass("rot90");
  });

  DOM_navCenter.on('click',".playlistPlay",function () {
    var temp = $(this).parent().siblings("ul").children();
    //console.log(temp);
    var songs = [];
    temp.each(function (i, data) {
      songs.push($(data).attr("data-name"));
    });

    var currPosString = [255,254,35,0,32,0,83,0,116,0,101,0,97,0,108,0,116,0,104,0,65,0,117,0,100,0,105,0,111,0,80,0,108,0,97,0,121,0,101,0,114,0,32,0,99,0,117,0,114,0,114,0,101,0,110,0,116,0,32,0,116,0,114,0,97,0,99,0,107,0,32,0,112,0,111,0,115,0,105,0,116,0,105,0,111,0,110,0,32,0,97,0,116,0,32,0,48,0,13,0,10,0];
    var origbuf = new Buffer(currPosString);
    var bufArr = [origbuf];
    for(var i=0 ; i<songs.length ; i++){
      bufArr.push(nameToBuf(songs[i]));
    }
    var finaldata = Buffer.concat(bufArr);
    fs.writeFile(batFiles.Root + "" + batFiles.M3U, finaldata ,{encoding:null}, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!');
        process.execFile(batFiles.Root + "" + batFiles.Start,function(err){
          //console.log(err);
          if(err){
            globals.svgicon[1].toPlayMode(svgIconConfig);
          }
        });
    });

  });

  $("#playlistItems").on('dblclick',"li",function () {
    var name = $(this).attr("data-name");
    process.exec('"' + globals.batFiles.Root + globals.batFiles.Start + '" "' + name + '"');
  });

  $("#playlistItems").on("contextmenu",".playlistItem",function (event) {
    //console.log(event);
    event.preventDefault();
    globals.plToDel = $(this).attr("data-name");
    var temp = $("#delCtxtBox");
    var body = $("body");
    var left = event.clientX;
    var top = event.clientY;
    if((left + 160) > body.width()){
      left = left - 170;
    } else{
      left += 10;
    }
    if((top + temp.height()) >= body.height()-75){
      top = body.height() - temp.height() - 80;
    }else if(top >= 92){
      top = top - 20;
    }
    temp.css({
      left:left + "px",
      top: top + "px"
    });
    temp.fadeIn(400);
  });


  $("#delCtxtBox").click(function () {
    delete globals.playlists[globals.plToDel];
    $(".playlistItem").each(function (i,data) {
      if($(data).attr("data-name") == globals.plToDel){
        $(data).remove();
      }
    });

    $("#ctxtplaylists").children().each(function (i,data) {
      if($(data).attr("data-name") == globals.plToDel){
        $(data).remove();
      }
    });
    $(this).fadeOut(200);
  });

  $("body > div:not(#delCtxtBox)").click(function(e) {
    $("#delCtxtBox").fadeOut(200);
  });

  $("#addPLctxt").click(function () {
    var name = prompt("New Playlist Name ");
    if(name){
      createPlaylist(name);
    }
  });
});
