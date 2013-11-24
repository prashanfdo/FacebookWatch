(function () {
    var elementId = 'fbtimer';
    var storageSeconds = 'fbwatch_seconds';
    var storageDay = 'fbwatch_day';
    //var IDLETO = 1 * 4 * 1000;
    var idleto = 10 * 1000;
    var timer = {
        seconds: 0,
        pause: true,
        running: false,
        reset : function() {
            this.seconds = 0;
            putToStorage(storageDay, new Date().toDateString());
        },
        start : function() {
            var savedSeconds = parseInt(getFromStorage(storageSeconds, 0));
            if (savedSeconds == 0)
                putToStorage(storageDay, new Date().toDateString());
            else
                this.seconds = savedSeconds;
        },
        addTick : function() {
            putToStorage(storageSeconds, ++timer.seconds);
            if (getFromStorage(storageDay, 0) != new Date().toDateString())
                timer.reset();
        }
    };
    var updateUi = function () {
        if (!timer.element) return;
        var seconds = timer.seconds % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        var minutes = parseInt((timer.seconds % 3600) / 60);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var hours = parseInt(timer.seconds / 3600);
        hours = hours > 0 ? hours + ' :' : '';
        timer.element.innerText = hours + minutes + ' : ' + seconds;
    };
    var run = function () {
        timer.running = true;
        updateUi();
        setTimeout(run, 1000);
        if (timer.pause) return;
        timer.addTick();
    }; 
    var inactiveTo = undefined;
    var activeListner = function () {
        timer.pause = false;
        if (inactiveTo)
            clearTimeout(inactiveTo);
        inactiveTo = setTimeout(function () {
            timer.pause = true;
        }, idleto);
    };
    window.addEventListener('mousemove', activeListner);
    window.addEventListener('click', activeListner);
    window.addEventListener('keypress', activeListner);
    window.addEventListener('keydown', activeListner);
    window.addEventListener('focus', function () {
        timer.pause = false;
        timer.start();
    });
    window.addEventListener('blur', function () {
        timer.pause = true;
    });
    var init = function () {
        if (!timer.running) {
            timer.start();
            run();
        }
        var ul = document.getElementById('pageNav');
        if (ul && !timer.element) {
            var li = document.createElement('li');
            li.innerHTML = '<span title="Double click to reset" class="navLink bigPadding" id="' + elementId + '"></span>';
            li.className = 'navItem middleItem';
            ul.insertBefore(li, ul.firstChild);
            timer.element = document.getElementById(elementId);
            timer.element.addEventListener('dblclick', function() {
                timer.reset();
            });
        }
    };
    var putToStorage = function (key, object) {
        localStorage.setItem(key, object);
    };
    var getFromStorage = function (key, def) { 
        return localStorage.getItem(key) || def || 0;
    };
    //window.addEventListener('load', function () {
    init();
    //});
})();