/*******************************************************************************
*   synth.js 
*   Mark Koh
* 
*   Description:
*   	Given envelope perameters, create a synth which can play notes
*       Based off: https://github.com/carlbarrdahl/tonematrix
*
*   Changelog:
*   	06-02-2014	Initial log
*   		     
*******************************************************************************/

function Synth(context, attack, decay, sustain, release, baseOctave) {

    //Private attributes
    var _context = context;
    var _attack = attack; //milliseconds
    var _decay = decay; //milliseconds
    var _sustain = sustain; //percent volume
    var _release = release; //milliseconds

    var _baseOctave = baseOctave; //Actually 5, but indices

    var _notes = {
        'C': 60,
        'C#': 61,
        'D': 62,
        'D#': 63,
        'E': 64,
        'F': 65,
        'F#': 66,
        'G': 67,
        'G#': 68,
        'A': 69,
        'A#': 70,
        'B': 71
    };
    
    var _voiceList = {};

    //Return an oscillator frequency for a given note
    this.getFreq = function (note) {
        if (note) {
            var key = note[0];
            var octave = note[1];
            var transpose = octave - _baseOctave;
            return 440 * Math.pow(2, (_notes[key] + transpose * 12 - 69) / 12);
        }
        else {
            console.error("Invalid note", note);
        }
    };

    //Play a given note
    // note = [key,octave]
    this.playNote = function(note) {
        if (!_voiceList[note]) {
            var freq = this.getFreq(note);
            _voiceList[note] = new Voice(freq, _context, _attack, _decay, _sustain, _release);
            _voiceList[note].start();
        }
    };

    //Stop a given note
    this.stopNote = function (note) {
        if (_voiceList[note]) {
            _voiceList[note].stop();
            _voiceList[note] = null;
        }
    }

    //Hit a given note
    this.hitNote = function (note) {
        this.playNote(note);
        this.stopNote(note);
    }

    /*************************************************************************/
    /*                          CONSTRUCTOR                                  */
    /*************************************************************************/

}