console.log("Initialising function...");
(function() {  
    console.log("We are inside the function!");
    var waitPeriod = 3650000;
    $('#hourlyBeatsTimerHolder > div button').click();

    setTimeout(function(){
        console.log("setTimeout function invoked");
        $('#hourlyBeatsTimerHolder > div button').click();
        console.log("Button clicked");
    }, waitPeriod);
    console.log("Outside function");

}).call(this);
