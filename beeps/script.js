(function(){
function loadApp() {
  var tick, tickup, ticking,
      tempoField = document.getElementById('tempo'),
      tempo = parseInt(tempoField.value);
  blip.sampleLoader()
    .samples({
      tick: 'sounds/metronome.wav',
      tickup: 'sounds/metronomeup.wav'
    })
    .done(loaded)
    .load();

  function loaded() {
    tick = blip.clip().sample('tick');
    tickup = blip.clip().sample('tickup');

    ticking = blip.loop()
      .tempo(tempo)
      .data([0,1,1,1])
      .tick(function(t, d){
        if (tempo != parseInt(tempoField.value)) {
          tempo = parseInt(tempoField.value);
          if (!tempo || tempo<40 || tempo>1000) {
            tempo = 100;
          }
          this.tempo(tempo);
        }
        if(d) {
          tick.play(t);
        } else {
          tickup.play(t);
        }
      });

    document.getElementById('start')
      .addEventListener('click', function(){
        ticking.start();
      });

    document.getElementById('stop')
      .addEventListener('click', function(){
        ticking.stop();
      });
  }
}

window.addEventListener('DOMContentLoaded', function(){
  loadApp();
});
})();
