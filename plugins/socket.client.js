import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import io from 'socket.io-client';

export default function () {
	Vue.use(
		new VueSocketIO({
			connection: io('http://localhost:5100', {
				reconnection: true,
				reconnectionDelay: 500,
			}),
		})
	);
}
