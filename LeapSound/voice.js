/*******************************************************************************
*   voice.js 
*   Mark Koh
* 
*   Description:
*   	The actual process used to create the sound for a given frequency.
*       Accepts parameters for a ADSR envelope.
*       Based off: https://github.com/carlbarrdahl/tonematrix
*
*   Changelog:
*   	06-02-2014	Initial log
*   		     
*******************************************************************************/

function Voice (freq,context,attack,decay,sustain,release){

    //Private attributes
	var _osc; //oscillator
	var _envelope; //gain node
	var _freq = freq;
	var _context = context;
	var _attack = attack; //milliseconds
	var _decay = decay; //milliseconds
	var _sustain = sustain; //percent volume
	var _release = release; //milliseconds
	var _start = null;


	// Create the envelope for playback
	this.setEnvelope = function () {
	    var now = _context.currentTime;
	    var decayStart = now + (_attack / 1000.0);
	    _start = now;

	    // Begin at silent 
	    _envelope.gain.setValueAtTime(0.0, now);
	    // Ramp up in /attack/ time to max volume
	    _envelope.gain.linearRampToValueAtTime(1.0, decayStart);
	    // Slope down to sustain volume in /decay/ time
	    _envelope.gain.setTargetAtTime((_sustain / 100.0), decayStart, (_decay / 1000.0) + 0.001);
	};

    // Start playback
	this.start = function () {
	    this.setEnvelope();
	    _osc.start();
	};

    // Stop playback now
	this.hardStop = function () {
	    var now = _context.currentTime;
	    var end = now + (_release / 1000.0);

	    // Stop any future actions that the oscillator should have
	    _envelope.gain.cancelScheduledValues(now);
	    // Begin at full volume
	    _envelope.gain.setValueAtTime(_envelope.gain.value, now);
	    // Ramp down to silent in /release/ time
	    _envelope.gain.setTargetValueAtTime(0.0, now, (_release / 1000.0));

	    // Stop the oscillator after /release/ time
	    _osc.stop(release);
	}

    // Stop playback (when the note is finished)
	this.stop = function () {
	    var now = _context.currentTime;
	    if (now < (_start + (_attack / 1000.0) + (_decay / 1000.0))) {
	        now = (_start + (_attack / 1000.0) + (_decay / 1000.0));
	    }
	    var end = now + (_release / 1000.0);

	    // Stop any future actions that the oscillator should have
	    _envelope.gain.cancelScheduledValues(now);
	    // Begin at full volume
	    _envelope.gain.setValueAtTime(_envelope.gain.value, now);
	    // Ramp down to silent in /release/ time
	    _envelope.gain.setTargetValueAtTime(0.0, now, (_release / 1000.0));

	    // Stop the oscillator after /release/ time
	    _osc.stop(release);
	};

    /*************************************************************************/
    /*                          CONSTRUCTOR                                  */
    /*************************************************************************/
	//Connect the components
	_osc = _context.createOscillator();
	_envelope = _context.createGain();
	_osc.connect(_envelope);
	_envelope.connect(_context.destination);

	//Set the frequency of the oscillator
	_osc.frequency.setValueAtTime(_freq, 0);
	
}