/**
 * Created by ASR on 07-03-2017.
 */
function hasUserMedia() {
    //check if the browser supports the WebRTC
    console.log("hasUM");
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia);
}

if (hasUserMedia()){
    console.log("1");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;
    console.log("2");
    navigator.getUserMedia({video:true, audio:true},function (stream) {
        console.log("3");

    var Peer = require("simple-peer");
    var peer = Peer({
        initiator: (location.hash === "#1"),
        trickle: false,
        stream:stream
    });
        console.log("4");
    peer.on('signal', function (data) {
        document.getElementById("yourId").value = JSON.stringify(data);

    });
        console.log("5");
    document.getElementById('connect').addEventListener('click', function () {
        var otherId = JSON.parse(document.getElementById("otherId").value);
        peer.signal(otherId);
    })

   /* document.getElementById('send').addEventListener('click', function () {
        var message = document.getElementById('yourMessage').value;

    })*/

        $("#yourMessage").keypress(function(e){
            if(e.which == 13) {
                var message=$("#yourMessage").val();
                if ((message!="")){
                    message=message.split('<').join('&lt;').split('>').join('&gt;');
                    var mesgpacket={
                        message: message,
                        myhash:toString(location.hash)
                    };
                    var MpStringify= JSON.stringify(mesgpacket);
                    peer.send(MpStringify);
                    $("#messages").append("<span class='s'>"+message+"</span><br><br>");
                      $("#yourMessage").val("");
                }
            }
        });

    peer.on('data', function (data) {
        var data1= JSON.parse(data);
        var mesg=data1.message;
        var user=data1.myhash;
        console.log("Message: "+mesg+"  User: "+user+" Hash: "+location.hash);
        if(location.hash === user){
            $("#messages").append("<span class='s'>"+mesg+"</span><br><br>");
        }else {
            $("#messages").append("<span class='r'>"+mesg+"</span><br><br>");
        }

    });

    peer.on('stream',function (stream) {
        var vid= document.getElementById('video');
        vid.src=window.URL.createObjectURL(stream);
        vid.play();
    });


},function (err) {
    console.log("Error!!");
});}