(function () {

    if(window.location.pathname.startsWith('/nd')) {
        return;
    }

    var [a, b, c, uuid, clientType] = window.location.pathname.split('/');

    var server = new io();

    var amITheMaster = clientType === 'm';

    sendMsg(amITheMaster ? 'master' : 'slave', '');

    server.on('key', function (msg) {
        var _i = JSON.parse(msg);
        Reveal.slide(_i.h, _i.v, _i.f);
    });

    server.on('sync', function(msg) {
        Reveal.slide(...msg.split('/'));
    });

    server.on('exit', function() { //master has exited
        alert('Presenter has left, switching to independent mode.');
        var arr = window.location.href.split('/');
        arr.splice(5, 2);
        arr.splice(3, 0, 'nd');
        window.location.assign(arr.join('/'));
    });

    if (amITheMaster) {
        document.addEventListener('keyup', sendKey);

        var navBtns = document.querySelectorAll('.controls button');

        navBtns.forEach(function (btn) {
            btn.addEventListener('click', sendKey);
        });

        Reveal.addEventListener( 'slidechanged', function( event ) {
            
        } );

        function sendKey() {
            sendMsg('key', JSON.stringify(Reveal.getIndices()));
        }

    } else {
        Reveal.configure({
            controls: false,
            keyboard: false,
            touch: false
        });
    }

    function sendMsg(evt, msg) {
        server.emit(evt, uuid + '///' + msg);
    }

})();