public class Time {

    private int myHours;
    private int myMinutes;
    
    public Time (String s) {
        int colonPos = s.indexOf (":");
        myHours = Integer.parseInt (s.substring (0, colonPos));
        myMinutes = Integer.parseInt (s.substring (colonPos+1));
    }
    
    public Time (int hours, int minutes) {
        myHours = hours;
        myMinutes = minutes;
    }

    public boolean equals (Object obj) {
	Time t = (Time) obj;
	return myHours == t.myHours && myMinutes == t.myMinutes;
    }

    public String toString ( ) {
        return myHours + ":" + myMinutes;
    }
    
    public void testConstructor ( ) {
        String [ ] timeArgs = {null, "x", "x:", ":x", "x:y", 
                "1:", ":30", "4:   35", "55:00", "11:99",
                " 3:30", "00004:45", "4:007", "4:7", "4 :09",
                "3:30", "11:55"};
        Time [ ] correctTimes = {null, null, null, null, null,
		null, null, null, null, null,
		null, null, null, null, null,
		new Time (3, 30), new Time (11, 55)};
        for (int k=0; k<timeArgs.length; k++) {
            Time t = new Time (timeArgs[k]);
            assertEquals (correctTimes[k], t);
        }
    }
}