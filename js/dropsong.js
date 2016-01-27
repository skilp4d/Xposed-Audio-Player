function handleDrop(callback, event) {
  event.stopPropagation();
  event.preventDefault();
  callback(Array.prototype.slice.call(event.dataTransfer.files));
}

function killEvent(e) {
  e.stopPropagation();
  e.preventDefault();
  return false;
}

function addDragDropListener(element, callback) {
  element.addEventListener("dragenter", killEvent, false);
  element.addEventListener("dragover", killEvent, false);
  element.addEventListener("drop", handleDrop.bind(undefined, callback), false);
}


addDragDropListener(document, function (files) {
    var file = files;
    var curfile;

    var callbackfn = function(err,result){
      console.log(err);
      if (!err){
        //console.log(file[itr]);
        //console.log(result);
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
            var name = curfile.path.split("\\").pop();
            tosave.imageUrl = globals.albumArts + name.substr(0,name.length - 4) + "." +  result.picture[0].format;
            savedImgName = name.substr(0,name.length - 4) + "." +  result.picture[0].format;
          }

          // Save the album art iff the album art doesnt exist already
          if(globals.albumArtsArr.indexOf(savedImgName) == -1){
            if (result.picture.length > 0) {
              var picture = result.picture[0];
              var databuffer = new Buffer(picture.data);
              fs.writeFile(globals.albumArts + savedImgName, databuffer, function(err){
                console.log("writtern");
                if(err){
                  //setBackground(globals.albumArts + "default.png");
                }else{
                  //setBackground(globals.albumArts + result.album + "." +  picture.format);
                }
              });
            }
          }

        }else{
          tosave.imageUrl = globals.albumArts + "default.png";
        }
        globals.songslist[curfile.path] = tosave;
        var batFiles = globals.batFiles;




        // Adding the song to Songs queue
        process.execSync('"' + globals.batFiles.Root + globals.batFiles.Start + '" /A' + ' "' + curfile.path + '"');

        // Rendering the item to the list
        //addRenderItem($("#nowPlayingList"),curfile.path);


      }
      // calling the function again if files are left;
      if(file.length > 0){
        curfile = file.shift();
        musicmetadata(curfile,callbackfn);
      }else{
        globals.addingMusic = false;
        globals.songsQueue = giveQueue();
      }


    };
    globals.addingMusic = true;
    curfile = file.shift();
      var mm = musicmetadata(curfile, callbackfn);

    // fs.readFile(batFiles.Root + "" + batFiles.M3U,function (err, data) {
    //     if (err) throw err;
    //     //Reading all the buffers
    //     //var zeroBuf = arrToBuf(currPosString);
    //     var origbuf = data;
    //     var songBuf = nameToBuf(file.path);
    //     var totalLen = data.length + songBuf.length;
    //     var finaldata = Buffer.concat([origbuf,songBuf], totalLen);
    //     //console.log(dataa);
    //
    //     fs.writeFile(batFiles.Root + "" + batFiles.M3U, finaldata ,{encoding:null}, function (err) {
    //         if (err) throw err;
    //         console.log('It\'s saved!');
    //         var songlist = globals.songsQueue;
    //         renderList($(".songsList"),songlist);
    //     });
    // });
});
