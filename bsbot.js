console.log("Initialising function...");
(function() {  
    console.log("We are inside the function!");
    var waitPeriod = 3650000;

    setTimeout(function(){
        console.log("setTimeout function invoked");
        $('#hourlyBeatsTimerHolder > button').click();
        console.log("Button clicked");
    }, waitPeriod);
    console.log("Outside function");

}).call(this);
