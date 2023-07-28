function Timer({
    callback = () => { },
    time = 0,             //  The default time of the timer
    mode = 1,             //  Mode: count up or count down
    interval = 1000,
} = {}) {
    var status = 0;       //  Status: timer is running or stoped. The timer running (1) or stoped (0)
    let timer_id;         //  This is used by setInterval function
    generateTime();

    // this will start the timer ex. start the timer with 1 second interval timer.start(1000) 
    this.start = function () {
        interval = (typeof (interval) !== 'undefined') ? interval : 1000;

        if (status == 0) {
            status = 1;
            timer_id = setInterval(function () {
                switch (mode) {
                    default:
                        if (time) {
                            time--;
                            generateTime();
                            if (typeof (callback) === 'function') callback(time);
                        }
                        break;

                    case 1:
                        if (time < 86400) {
                            time++;
                            generateTime();
                            if (typeof (callback) === 'function') callback(time);
                        }
                        break;
                }
            }, interval);
        }
    }

    //  Same as the name, this will stop or pause the timer ex. timer.stop()
    this.stop = function () {
        if (status == 1) {
            status = 0;
            clearInterval(timer_id);
        }
    }

    // Reset the timer to zero or reset it to your own custom time ex. reset to zero second timer.reset(0)
    this.reset = function (sec) {
        sec = (typeof (sec) !== 'undefined') ? sec : 0;
        time = sec;
        generateTime();
    }

    // Change the mode of the timer, count-up (1) or countdown (0)
    this.mode = function (tmode) {
        mode = tmode;
    }

    // This methode return the current value of the timer
    this.getTime = function () {
        return time;
    }

    // This methode return the current mode of the timer count-up (1) or countdown (0)
    this.getMode = function () {
        return mode;
    }

    // This methode return the status of the timer running (1) or stoped (0)
    this.getStatus
    {
        return status;
    }

    // This methode will render the time variable to hour:minute:second format
    function generateTime() {
        var second = time % 60;
        var minute = Math.floor(time / 60) % 60;
        var hour = Math.floor(time / 3600) % 60;

        second = (second < 10) ? '0' + second : second;
        minute = (minute < 10) ? '0' + minute : minute;
        hour = (hour < 10) ? '0' + hour : hour;

        document.querySelector('div.timer span.second').innerHTML = second;
        document.querySelector('div.timer span.minute').innerHTML = minute;
        document.querySelector('div.timer span.hour').innerHTML = hour;
    }
}

// var timer = new Timer({
//     time: 7,
//     mode: 0,
// });

