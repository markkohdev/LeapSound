/*----------------  Intervals JS  --------------------*/
/*                    MBK                          */

/***************************************************

This is the code used for handling swipe gestures
captured by the Leap Motion Controller.  When a swipe
is found, onSwipe(frame, gesture) should be called to
handle the data.

****************************************************/

var Interval = {
    DATABASE:  ["one1", "two1", "thr1", "for1", "fiv1", "six1", "sev1", "one2", "two2", "thr2", "for2", "fiv2", "six2", "sev2", "one3", "two3", "thr3", "for3", "fiv3", "six3", "sev3", "one4"],
    updated: false,
    loadout: {},
    populate: function() {
        if (updated == false)
        {						
            var modeOffset;
            if (Key.current == "C Minor")
                modeOffset = Mode.DATABASE[Mode.index].minorPos;
            else
                modeOffset = Mode.DATABASE[Mode.index].majorPos;
				
            for (var i = 0; i < DATABASE.length; i++)
            loadout[DATABASE[i]] = Key.DATABASE[Key.index][i + modeOffset];
				
            updated = true;
        }	
    }
}