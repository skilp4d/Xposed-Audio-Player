var nameToBuf = function(name){
  var data = [];
  for(var i=0;i<name.length;i++){
    data.push(name.charCodeAt(i));
    data.push(0);
  }
  data.push(13);
  data.push(0);
  data.push(10);
  data.push(0);
  return new Buffer(data);
};

var arrToBuf = function(arr){
  return new Buffer(arr);
};

var setBackground = function(filename){
   var tokens = filename.split("\\");
   var name = tokens.join("/");
   if(globals.bgImage == name){
     return;
   }
   console.log("setting bg");
    globals.bgImage = name;
    var img = new Image();
    img.addEventListener("load", function(){
        var imgheight = this.naturalHeight;
        var imgwidth = this.naturalWidth;
        var bodyheight = globals.body.height()-75;
        var bodywidth = globals.body.width();
        var top = 0;
        var left = 0;
        var width,height;
        if(globals.body.height()>imgheight){
          if(globals.body.width()>imgwidth){
            width = imgwidth;
            height = imgheight;
          }else{
            width = bodywidth;
            height = (width/imgwidth)*imgheight;
          }
        }else{
          if(globals.body.width()>imgwidth){
            height = bodywidth;
            width = (height/imgheight)*imgwidth;
          }else{
            if(imgwidth>imgheight){
              width = bodywidth;
              height = (width/imgwidth)*imgheight;
            }else{
              height = bodyheight;
              width = (height/imgheight)*imgwidth;
            }
          }
        }
        top = (bodyheight - height)/2;
        left = (bodywidth - width)/2;
        // alert("top "+ top+
        // "width "+ width+
        // "height "+ height+
        // "left "+ left);
        //console.log(filename);
        globals.body.css({
          "background-image":"url('"+ name +"')",
          "background-repeat":"no-repeat",
          "background-size":width + "px " + height + "px",
          "background-position":left + "px " + top + "px",
        });
    });
    img.src = name;
};


var renderList = function (rootelem,songlist) {
  //rootelem is the jquery selected object
  rootelem.html("");
  //console.log(songlist);
  for(var i=0; i<songlist.length; i++){
    var metadata = globals.songslist[songlist[i]];
    //console.log(metadata);
    if(metadata){
      var artist = "Unknown";
      if(metadata.albumartist.length === 0){
        if(metadata.artist.length === 0){
          artist = "Unknown";
        }else{
          artist = metadata.artist[0];
        }
      }else{
        artist = metadata.albumartist[0];
      }
      var title = metadata.title? metadata.title : "Unknown";
      var album = metadata.album? metadata.album : "Unknown";
      rootelem.append(
        '<div class="songQueueItem marquee"' +' data-name="' + songlist[i] +'" data-index="'+ i +'">'+
          '<em class="songArtist">'+ artist +' - </em>'+
          title +' - '+
          '<em class="songAlbum">'+ album +'</em>'+
        '</div>'
      );
    }
  }
};

var renderAllSongs = function (rootelem,songlist) {
  //rootelem is the jquery selected object
  rootelem.html("");
  //console.log(songlist);
  Object.keys(globals.songslist).forEach(function (key) {
    var metadata = globals.songslist[key];
    //console.log(metadata);


    if(metadata){
      var artist = "Unknown";
      if(metadata.albumartist.length === 0){
        if(metadata.artist.length === 0){
          artist = "Unknown";
        }else{
          artist = metadata.artist[0];
        }
      }else{
        artist = metadata.albumartist[0];
      }
      var title = metadata.title? metadata.title : "Unknown";
      var album = metadata.album? metadata.album : "Unknown";
      rootelem.append(
        '<div class="allSongsItem"' +' data-name="' + key +'">'+
          '<em class="songArtist">'+ artist +' - </em>'+
          title +' - '+
          '<em class="songAlbum">'+ album +'</em>'+
        '</div>'
      );
    }
  });
};


var addAllSongsItem = function (rootelem, metadata, name) {
  if(metadata){
    var artist = "Unknown";
    if(metadata.albumartist.length === 0){
      if(metadata.artist.length === 0){
        artist = "Unknown";
      }else{
        artist = metadata.artist[0];
      }
    }else{
      artist = metadata.albumartist[0];
    }
    var title = metadata.title? metadata.title : "Unknown";
    var album = metadata.album? metadata.album : "Unknown";
    rootelem.append(
      '<div class="allSongsItem"' +' data-name="' + name +'">'+
        '<em class="songArtist">'+ artist +' - </em>'+
        title +' - '+
        '<em class="songAlbum">'+ album +'</em>'+
      '</div>'
    );
  }
};

var addRenderItem = function (rootelem , item) {
  var metadata = globals.songslist[item];
  //console.log(metadata);
  if(metadata){
    var index = $('.songQueueItem').length;
    var artist = "Unknown";
    if(metadata.albumartist.length === 0){
      if(metadata.artist.length === 0){
        artist = "Unknown";
      }else{
        artist = metadata.artist[0];
      }
    }else{
      artist = metadata.albumartist[0];
    }
    var title = metadata.title? metadata.title : "Unknown";
    var album = metadata.album? metadata.album : "Unknown";
    rootelem.append(
      '<div class="songQueueItem marquee"' +' data-name="' + item +'" data-index="'+ index +'">'+
        '<em class="songArtist">'+ artist +' - </em>'+
        title +' - '+
        '<em class="songAlbum">'+ album +'</em>'+
      '</div>'
    );
  }
};


var renderSearchSongs = function (rootelem, list, heading) {
  rootelem.append("<h2 class='searchListHeading'>"+ heading + "</h2>");
  for(var i = 0; i < list.length ; i++){
    metadata = globals.songslist[list[i]];
    var artist = "Unknown";
    if(metadata.albumartist.length >= 0){
      artist = metadata.albumartist[0];
    }
    var title = metadata.title;
    rootelem.append(
      '<div class="searchItemSong"' +' data-name="' + list[i] +'">'+
        '<h3 class="searchSongTitle">'+ title +'</h3>'+
        '<h4 class="searchSongAA">'+ artist +'</h4>'+
      '</div>'
    );
  }
};

var renderSearchArtists = function (rootelem, obj, heading) {
  rootelem.append("<h2 class='searchListHeading'>"+ heading + "</h2>");
  Object.keys(obj).forEach(function (key) {
    var count = obj[key];
    var artist = key;
    var countstr = count + " Song";
    if(count > 1){
      countstr = count + " Songs";
    }
    rootelem.append(
      '<div class="searchItemArtist"' +' data-name="' + artist +'">'+
        '<h3 class="searchArtistName">'+ artist +'</h3>'+
        '<h4 class="searchArtistSongs">'+ countstr +'</h4>'+
      '</div>'
    );
  });
};


var renderSearchAlbums = function (rootelem, obj, heading) {
  rootelem.append("<h2 class='searchListHeading'>"+ heading + "</h2>");
  Object.keys(obj).forEach(function (key) {
    var count = obj[key];
    var album = key;
    var countstr = count + " Song";
    if(count > 1){
      countstr = count + " Songs";
    }
    rootelem.append(
      '<div class="searchItemAlbum"' +' data-name="' + album +'">'+
        '<h3 class="searchAlbumName">'+ album +'</h3>'+
        '<h4 class="searchAlbumSongs">'+ countstr +'</h4>'+
      '</div>'
    );
  });
};

var updateMusicFileAndPlay = function (names) {
  var currPosString = [255,254,35,0,32,0,83,0,116,0,101,0,97,0,108,0,116,0,104,0,65,0,117,0,100,0,105,0,111,0,80,0,108,0,97,0,121,0,101,0,114,0,32,0,99,0,117,0,114,0,114,0,101,0,110,0,116,0,32,0,116,0,114,0,97,0,99,0,107,0,32,0,112,0,111,0,115,0,105,0,116,0,105,0,111,0,110,0,32,0,97,0,116,0,32,0,48,0,13,0,10,0];
  var origbuf = new Buffer(currPosString);
  var totallen = 0;
  var buffersArray = [];
  buffersArray.push(origbuf);
  totallen += origbuf.length;
  for(var i=0 ; i<names.length ; i++){
    var temp = nameToBuf(names[i]);
    buffersArray.push(temp);
    totallen += temp.length;
  }

  var finalBuf = Buffer.concat(buffersArray, totallen);
  //console.log(dataa);
  fs.writeFile(batFiles.Root + "" + batFiles.M3U, finalBuf ,{encoding:null}, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
      renderList($("#nowPlayingList"),names);
      process.execFile(batFiles.Root + "" + batFiles.Start,function(err){
        console.log(err);
        if(err){
          globals.svgicon.toggle(svgIconConfig);
        }
      });
  });
};


var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


var createPlaylist = function (name) {
  var PLs = globals.playlists;
  var playlists;
  if(!PLs){
    playlists = {};
  }else{
    playlists = PLs;
  }
  playlists[name] = [];
  globals.playlists = playlists;
  addPlaylistItem(name,[]);
};


var addPlaylistItem = function (name,arr) {
  $("#ctxtplaylists").append("<li data-name='"+ name +"'>" + name+ "</li>");
  var temp = "";
  if(arr.length === 0){
    temp = "<li>No songs Yet</li>";
  }
  for(var i=0 ; i<arr.length; i++){
    //console.log(arr[i]);
    var key = arr[i];
    var meta = globals.songslist[ key ];
    //console.log(meta);
    var title = meta.title;
    temp+= '<li class="plsongItem" data-name="'+ arr[i] +'">' + title + '</li>';
  }
  $("#playlistItems").append(
    '<div class="playlistItem" data-name="'+ name +'">'+
      '<div class="plItemCont">'+
        '<span>' + name +'</span>'+
        '<span class="playlistPlay"></span>'+
        '<span class="playlistAccord"></span>'+
      '</div>'+
      '<ul>'+ temp +
      '</ul>'+
    '</div>'
  );
};
