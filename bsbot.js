var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

(function() {  

    var waitPeriod = 3650000;

    setTimeout(function(){
        $('#hourlyBeatsTimerHolder > button').click();
    }, waitPeriod);

}).call(this);
