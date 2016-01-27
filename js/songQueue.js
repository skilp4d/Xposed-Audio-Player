globals.count = 0;
globals.Playing = false;
globals.weChanged = false;
globals.watch = true;
var rootFile = globals.batFiles.Root;
var towatch = rootFile.substr(0,rootFile.length);
fs.watch(towatch,function(curr,prev){
  if(prev === "StealthAudioPlayer.m3u"){
    if(globals.addingMusic === false){
      globals.songsQueue = giveQueue();
      var song = globals.songsQueue[0];
      var result = globals.songslist[song];
      if(result){
        setBackground(result.imageUrl);
      }else{
        setBackground(globals.albumArts + "default.png");
      }
      $("#nowPlaying").html(result.title);
      if(globals.songsQueue.length == 1){
        var temp = Object.keys(globals.songslist);
        var songnum = parseInt(Math.random()*temp.length);
        name = temp[songnum];
        process.exec('"' + globals.batFiles.Root + globals.batFiles.Start + '" /A' + ' "' + name + '"');
      }
      //console.log(globals.songsQueue);
      var songlist = globals.songsQueue;
      //renderList($("#nowPlayingList"),songlist);
      process.exec('tasklist /fi "Imagename eq StealthAudioPlayer.exe"', function(err, stdout, stderr) {
        if(stdout){
          if(stdout.substr(0,4) == "INFO"){
            //Some error occured

            
            // var temp = Object.keys(globals.songslist);
            // var song = parseInt(Math.random()*temp.length);
            // name = temp[song];
            globals.svgicon[1].toPlayMode(svgIconConfig);
          }else{
            globals.svgicon[1].toStopMode(svgIconConfig);
          }
        }
      });
    }
  }

});

var str;

function giveQueue(){
  var songnames = [];
  var data = fs.readFileSync(globals.batFiles.Root + "" + globals.batFiles.M3U,'utf8');
      var str = data;
      var lines = [];
      var ind = str.search("#\0 \0S\0t\0e\0a\0l\0t\0h");
      for(var i=0 ;i<str.length; i+=2){
        if(str[i] == "\n"){
          lines.push(i);
        }
      }
      for(var j=0 ; j < lines.length-1 ;j++){
        if( lines[j] > ind){
          name = str.substr( lines[j] + 1 , lines[j+1] );
          //console.log(name);
          var haha = "";
          for(var k=1; k<lines[j+1]-lines[j]-3;k+=2){
            if( name[k] !== "\0"){
              haha += name[k];
            }
          }
          //console.log(haha);
          if(haha.length >0){
            songnames.push(haha);
          }
        }
      }
  return songnames;
}

function withoutEscape(name){
  var toret = "";
  for(var i=0;i<name.length;i++){
    if(name[i] !== "\\"){
      toret+=name[i];
    }
  }
  return toret;
}
