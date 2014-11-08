(function(){
  var FREQ_REF = {
    big: [
      {key: 'C', mid: 65.406},
      {key: 'C#', mid: 69.296},
      {key: 'D', mid: 73.416},
      {key: 'D#', mid: 77.782},
      {key: 'E', mid: 82.407},
      {key: 'F', mid: 87.307},
      {key: 'F#', mid: 92.499},
      {key: 'G', mid: 97.999},
      {key: 'G#', mid: 103.83},
      {key: 'A', mid: 110.00},
      {key: 'A#', mid: 116.54},
      {key: 'B', mid: 123.47}
    ],
    small: [
      {key: 'C', mid: 130.81},
      {key: 'C#', mid: 138.59},
      {key: 'D', mid: 146.83},
      {key: 'D#', mid: 155.56},
      {key: 'E', mid: 164.81},
      {key: 'F', mid: 174.61},
      {key: 'F#', mid: 185.00},
      {key: 'G', mid: 196.00},
      {key: 'G#', mid: 207.65},
      {key: 'A', mid: 220.00},
      {key: 'A#', mid: 233.08},
      {key: 'B', mid: 246.94}
    ],
    first: [
      {key: 'C', mid: 261.63},
      {key: 'C#', mid: 277.18},
      {key: 'D', mid: 293.66},
      {key: 'D#', mid: 311.13},
      {key: 'E', mid: 329.63},
      {key: 'F', mid: 349.23},
      {key: 'F#', mid: 369.99},
      {key: 'G', mid: 392.00},
      {key: 'G#', mid: 415.30},
      {key: 'A', mid: 440.00},
      {key: 'A#', mid: 466.16},
      {key: 'B', mid: 493.88}
    ]
  };

  var prevOct, prevNote, medFreq;
  for (var oct in FREQ_REF) {
    for (var note in FREQ_REF[oct]) {
      if (note==0) {
        if (prevOct) {
          medFreq = (FREQ_REF[oct][note].mid +
                     FREQ_REF[prevOct][prevNote].mid)/2;
          FREQ_REF[oct][note].min = medFreq;
          FREQ_REF[prevOct][prevNote].max = medFreq;
        }
      } else {
        medFreq = (FREQ_REF[oct][note].mid +
                   FREQ_REF[oct][prevNote].mid)/2;
        FREQ_REF[oct][note].min = medFreq;
        FREQ_REF[oct][prevNote].max = medFreq;
      }
      prevNote = note;
    }
    prevOct = oct;
  }
  console.log(FREQ_REF);

function loadApp() {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);

  var audioCtx = new (window.AudioContext ||
                      window.webkitAudioContext)(),
      canvas = document.querySelector('.visualizer'),
      freqSpan = document.getElementById('freq'),
      noteSpan = document.getElementById('note'),
      centsSpan = document.getElementById('cents'),
      canvasCtx = canvas.getContext("2d"),
      source,
      stream;

  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength);

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

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      requestAnimationFrame(draw);
      var peakFreq = getPeakFrequency(dataArray);
      analyser.getByteFrequencyData(dataArray);
      freqSpan.textContent = peakFreq;
      noteSpan.textContent = detectGuitarNote(peakFreq);
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

  function getFrequencyValue(frequency) {
    var nyquist = audioCtx.sampleRate/2;
    var index = Math.round(frequency/nyquist * dataArray.length);
    return dataArray[index];
  }

  function getPeakFrequency(freqDomain) {
    var maxIndex = 0,
        maxValue = Array.prototype.reduce.call(freqDomain,
      function(amp1,amp2, i) {
        if (amp1 > amp2) {
          return amp1;
        } else {
          maxIndex = i;
          return amp2;
        };
      }, 0);
    var nyquist = audioCtx.sampleRate/2;
    return Math.round(nyquist / dataArray.length * maxIndex);
  }

  function detectGuitarNote(freq) {
    var minDelta = Infinity,
        cents,
        delta,
        minmax,
        closestNote,
        posDelta;
    Object.keys(FREQ_REF).forEach(function (oct) {
      FREQ_REF[oct].forEach(function (note) {
        delta = freq - note.mid;
        if (delta > 0) {
          minmax = 'max';
        } else {
          minmax = 'min';
        }
        cents = (note[minmax] -
                 note.mid) / delta;
        centsSpan.textContent = cents;

        posDelta = Math.abs(delta);
        if (posDelta < minDelta) {
          minDelta = posDelta;
          closestNote = note.key;
        }
      });
    });

    return closestNote;
  }
}

window.addEventListener('DOMContentLoaded', function(){
  loadApp();
});
})();
