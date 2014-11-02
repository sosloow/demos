(function(){
function loadApp() {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);

  var audioCtx = new (window.AudioContext ||
                      window.webkitAudioContext)(),
      canvas = document.querySelector('.visualizer'),
      canvasCtx = canvas.getContext("2d"),
      source,
      stream;

  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;

  if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.getUserMedia(
      {audio: true},
      function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

      	visualize();
      },
      function(err) {
        console.log('The following gUM error occured: ' + err);
      }
    );
  } else {
    console.log('getUserMedia not supported on your browser!');
  }

  function visualize() {
    var WIDTH = canvas.width,
        HEIGHT = canvas.height;

    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

        x += barWidth + 1;
      }
    };

    draw();
  }
}

window.addEventListener('DOMContentLoaded', function(){
  loadApp();
});
})();
