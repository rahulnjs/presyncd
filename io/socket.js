const socketIO = require('socket.io');


module.exports.init = function(server) {

    const io = socketIO(server);

    global._ps = {
        ms: {}
    };

    io.on('connection', (client) => {

        client.on('master', function (msg) {
            var room = getRoom(msg);
            if(room) {
                room.master = client;
                room.users[client.id] = client;
                global._ps.ms[client.id] = room._id;
            }
        });

        client.on('slave', function (msg) {
            var room = getRoom(msg);
            if (room) {
                room.users[client.id] = client;
            }
        });

        client.on('sync', function (msg) {
            broadcast('sync', getRoom(msg));
        });

        client.on('key', function (msg) {
            var room = getRoom(msg);
            if (client.id == room.master.id) {
                broadcast('key', room);
            }
        });

        client.on('disconnect', function (msg) {
            var pid = global._ps.ms[client.id];
            if (pid) {
                broadcast('exit', global._ps[pid]);
                delete global._ps[pid];
            }
        })

        function getRoom(msg) {
            var parts = msg.split('///');
            var room = global._ps[parts[0]];
            if (room) {
                room._msg = parts[1];
                room._id = parts[0];
            } else {
                console.log('No Rooms for', msg);
            }
            return room;
        }

    });

    function broadcast(evt, room) {
        Object.keys(room.users).forEach(function (id) {
            var client = room.users[id];
            if (client.id != room.master.id) {
                client.emit(evt, room._msg);
            }
        });
    }

}