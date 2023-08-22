//////////////////////////////////////////////////////////////////////////////////
// piano_instrument.js                                                          //
// Contains the piano class that the user will ultimately be interacting with   //
//////////////////////////////////////////////////////////////////////////////////
"use strict";

class Piano
{
    constructor()
    {
        this.note_list      = this.initializeNoteList() ; // [Array] Contains all the notes a piano uses in text form
        this.transposition  = 0                         ; // [Integer] Offset of the current key
        this.instrument     = "bright_acoustic_piano"   ; // [String ] Name of the instrument
        this.soundfont_instrument = null                ; // [Soundfont Instrument] From the Soundfont library, used to play sounds of a particular instrument
        this.volume         = 100                       ; // [Integer] 0-100 - How loud the entire program is
        this.velocity       = 127                       ; // [Integer] 0x00-0xFF - 8 bit value representing how loud a piano key is played
        this.sustain        = true                      ; // [Boolean] True=keep playing sound even while key is not pressed
                                                          //           False=stop playing sound when key is unpressed
        
    }
    initializeNoteList()
    {
        var resulting_note_list = [];
        var note_list           = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        var octaves             = 8;
        var notes_in_an_octave  = 12;

        for (var j = 0; j < octaves; j++)
        {
            for (var i = 0; i < notes_in_an_octave; i++)
            {
                resulting_note_list.push(note_list[i] + j);
            }
        }

        return resulting_note_list;
    }
    increaseTransposition()
    {
        this.transposition++;
    }
    decreaseTransposition()
    {
        this.transposition--;
    }
    setTransposition(transposition)
    {
        this.transposition = Number(transposition);
    }
    changeTransposition(transposition)
    {
        this.transposition += Number(transposition);
    }
    getInstrument()
    {
        return this.instrument;
    }
    setInstrument(instrument)
    {
        // Setting this to null so the soundfont object recreates the instrument
        this.soundfont_instrument = null;
        this.instrument = instrument;
    }
    findNoteIndex(note)
    {
        for (var i = 0; i < this.note_list.length; i++)
        {
            if (note == this.note_list[i])
            {
                return i;
            }
        }

        return -1;
    }
    playNote(note)
    {
        var note_index = this.findNoteIndex(note);
        var instrument_handler_object = this;

        if (this.soundfont_instrument == null)
        {
            Soundfont.instrument(audio_context, instrument_handler_object.getInstrument()).then(function (instr)
            {
                instrument_handler_object.soundfont_instrument = instr;
            });
        }
        else
        {
            var note = this.note_list[note_index + this.transposition];

            return this.soundfont_instrument.play(note);
        }

        return null;
    }
}