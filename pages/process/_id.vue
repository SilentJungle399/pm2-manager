<template>
	<div class="prcont">
		<div v-if="process">
			<h1 style="padding: 20px; text-align: center">
				{{ this.process.name }}
			</h1>
			<v-row no-gutters style="padding: 10px 5vh 0">
				<v-col style="text-align: center">
					Process controls:
					<v-btn
						style="width: 80px; margin: 5px"
						color="primary"
						small
						@click="$socket.emit('restart', process.id)"
					>
						{{ process.status !== 'online' ? 'Start' : 'Restart' }}
					</v-btn>
					<v-btn
						style="width: 80px; margin: 5px"
						:disabled="process.status !== 'online'"
						color="red"
						small
						@click="$socket.emit('stop', process.id)"
					>
						Stop
					</v-btn>
				</v-col>

				<v-col style="text-align: center">
					Process logs:
					<v-btn
						style="width: 80px; margin: 5px"
						color="primary"
						small
						:to="'/logs/' + process.id"
					>
						Logs
					</v-btn>
					<v-btn
						style="width: 80px; margin: 5px"
						color="red"
						small
						:to="'/errors/' + process.id"
					>
						Errors
					</v-btn>
				</v-col> </v-row
			><br /><br />
			<h2 style="padding: 20px; text-align: center">Monitoring</h2>
			<v-row no-gutters style="padding: 0 2vh 10px">
				<v-col>
					<canvas ref="memdata"></canvas>
				</v-col>
			</v-row>
			<v-row no-gutters style="padding: 0 2vh 10px">
				<v-col>
					<canvas ref="cpudata"></canvas>
				</v-col>
			</v-row>
		</div>
		<div v-else>Loading...</div>
	</div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
	data() {
		return {
			process: null,
			interval: null,
			memchart: null,
			cpuchart: null,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						min: 0,
					},
				},
				elements: {
					point: {
						radius: 0,
					},
				},
				animation: false,
			},
			memData: {
				labels: [...Array(60)]
					.map((_, index) => index + 1 + 's')
					.reverse(),
				datasets: [
					{
						label: 'Ram (MB)',
						backgroundColor: '#ff00ff',
						borderColor: '#ff00ff',
						data: [...Array(60)].map((_, index) => 0).reverse(),
						tension: 0.25,
					},
				],
			},
			cpuData: {
				labels: [...Array(60)]
					.map((_, index) => index + 1 + 's')
					.reverse(),
				datasets: [
					{
						label: 'CPU (%)',
						backgroundColor: '#ff00ff',
						borderColor: '#ff00ff',
						data: [...Array(60)].map((_, index) => 0).reverse(),
						tension: 0.25,
					},
				],
			},
		};
	},
	mounted() {
		if (this.interval) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(() => {
			this.$socket.emit('getProcess', this.$route.params.id);
		}, 1000);
	},
	destroyed() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	},
	sockets: {
		getProcessRet(data) {
			this.process = data;
			if (!this.memchart || this.memchart.data.datasets.length === 0)
				return;
			const rd = [...this.memchart.data.datasets[0].data];
			rd.push(data.mem);
			rd.shift();
			this.memchart.data.datasets[0].data = rd;
			this.memchart.update();
			const cd = [...this.cpuchart.data.datasets[0].data];
			cd.push(data.cpu);
			cd.shift();
			this.cpuchart.data.datasets[0].data = cd;
			this.cpuchart.update();
			this.$load.done();
		},
	},
	watch: {
		process(after, before) {
			if (!before) {
				setTimeout(() => {
					console.log(this.$refs.memdata);
					this.memchart = new Chart(this.$refs.memdata, {
						type: 'line',
						data: this.memData,
						options: this.options,
					});
					console.log(this.$refs.memdata);
					this.cpuchart = new Chart(this.$refs.cpudata, {
						type: 'line',
						data: this.cpuData,
						options: this.options,
					});
				}, 1000);
			}
		},
	},
};
</script>

<style>
.prcont {
	margin: 20px;
	height: calc(100vh - 130px);
	overflow-y: auto;
	border-radius: 10px;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
	background-color: #222;
}

.prcont::-webkit-scrollbar {
	width: 7px;
	height: 7px;
}
/* Track */
.prcont::-webkit-scrollbar-track {
	background: #212121;
	border-radius: 10px;
}

/* Handle */
.prcont::-webkit-scrollbar-thumb {
	background: rgb(0 26 26 / 1);
	border-radius: 10px;
}
/* Handle on hover */
.prcont::-webkit-scrollbar-thumb:hover {
	background: rgb(0, 0, 0);
}
</style>
