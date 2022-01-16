const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: true,
});
const pm2 = require('pm2');
const ms = require('ms');
const fs = require('fs');
const port = 5100;
const passw = 'something';
const errLs = {};
const logLs = {};

pm2.connect((err) => {
	if (err) {
		console.error(err);
	}
	pm2.launchBus((err, bus) => {
		if (err) {
			console.error(err);
		}
		bus.on('log:err', (err) => {
			for (i in errLs) {
				if (err.process.pm_id.toString() === errLs[i].toString()) {
					io.to(i).emit('addErr', err.data);
				}
			}
		});
		bus.on('log:out', (msg) => {
			for (i in logLs) {
				if (msg.process.pm_id.toString() === logLs[i].toString()) {
					io.to(i).emit('addLog', msg.data);
				}
			}
		});
	});
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
				uptime:
					process.pm2_env.status === 'online'
						? ms(Date.now() - process.pm2_env.pm_uptime)
						: 0,
				status: process.pm2_env.status,
				cpu: process.monit.cpu + '%',
				mem: (process.monit.memory / 1024 ** 2).toFixed(1) + 'mb',
				user: process.pm2_env.username,
			};
		});
		socket.emit('initProcesses', ret);
	});
}

io.on('connection', (socket) => {
	console.log('Client connected');
	socket.on('auth', (data) => {
		if (data === passw) {
			socket.emit('authRet', true);
			const interval = setInterval(() => {
				try {
					refresh(socket);
				} catch (e) {
					console.error(e);
					clearInterval(interval);
				}
			}, 5000);
		} else {
			socket.emit('authRet', false);
		}
	});
	socket.on('createErrLs', (data) => {
		errLs[socket.id] = data.id;
		pm2.describe(parseInt(data.id), (err, process) => {
			if (err) {
				console.error(err);
			}
			fs.readFile(
				process[0].pm2_env.pm_err_log_path,
				'utf8',
				(err, data) => {
					if (err) {
						console.error(err);
					}
					const lines = data.split('\n').slice(-100);
					socket.emit('addErr', lines.join('\n'));
				}
			);
		});
	});
	socket.on('createLogLs', (data) => {
		logLs[socket.id] = data.id;
		pm2.describe(parseInt(data.id), (err, process) => {
			if (err) {
				console.error(err);
			}
			fs.readFile(
				process[0].pm2_env.pm_out_log_path,
				'utf8',
				(err, data) => {
					if (err) {
						console.error(err);
					}
					const lines = data.split('\n').slice(-100);
					socket.emit('addLog', lines.join('\n'));
				}
			);
		});
	});
	socket.on('disconnect', () => {
		delete errLs[socket.id];
		delete logLs[socket.id];
	});
	socket.on('restart', (data) => {
		pm2.restart(parseInt(data), (err) => {
			if (err) {
				console.error(err);
			}
		});
	});
	socket.on('stop', (data) => {
		pm2.stop(parseInt(data), (err) => {
			if (err) {
				console.error(err);
			}
		});
	});
});

server.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
