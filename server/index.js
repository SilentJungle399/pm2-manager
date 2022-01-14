const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: true,
});
const pm2 = require('pm2');
const ms = require('ms');
const port = 5000;

pm2.connect((err) => {
	if (err) {
		console.error(err);
	}
});

function refresh(socket) {
	pm2.list((err, list) => {
		if (err) {
			console.error(err);
		}
		const ret = list.map((process) => {
			return {
				name: process.name,
				id: process.pm_id,
				uptime: ms(Date.now() - process.pm2_env.pm_uptime),
				status: process.pm2_env.status,
				cpu: process.monit.cpu + "%",
				mem: (process.monit.memory / 1024 ** 2).toFixed(1) + 'mb',
				user: process.pm2_env.username,
			};
		});
		socket.emit('initProcesses', ret);
	});
}

io.on('connection', (socket) => {
	console.log('Client connected');
	const interval = setInterval(() => {
		try {
			refresh(socket);
		} catch (e) {
			console.error(e);
			clearInterval(interval);
		}
	}, 5000);
});

server.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
