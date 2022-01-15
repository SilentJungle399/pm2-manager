<template>
	<div class="textContainer grey darken-4" v-html="retLogs"></div>
</template>

<script>
export default {
	data() {
		return {
			logs: '',
		};
	},
	mounted() {
		this.$load.done();
		this.$socket.emit(
			`create${this.$route.params.lsmode === 'logs' ? 'Log' : 'Err'}Ls`,
			{
				id: this.$route.params.id,
			}
		);
	},
	sockets: {
		authRet(data) {
			this.$socket.emit(
				`create${
					this.$route.params.lsmode === 'logs' ? 'Log' : 'Err'
				}Ls`,
				{
					id: this.$route.params.id,
				}
			);
		},
		addErr(data) {
			if (this.$route.params.lsmode === 'logs') {
				return;
			}
			this.logs += data.replace(/\n$/, '') + '\n';
		},
		addLog(data) {
			if (this.$route.params.lsmode === 'errors') {
				return;
			}
			this.logs += data.replace(/\n$/, '') + '\n';
		},
	},
	computed: {
		retLogs() {
			return this.logs.length > 0
				? this.logs.replace(/\n/gi, '<br>').replace(/ /gi, '&nbsp;')
				: 'No logs found.';
		},
	},
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto+Mono:wght@300&display=swap');

.textContainer {
	padding: 20px;
	height: calc(100vh - 4vh - 88px);
	width: -webkit-fill-available;
	overflow-y: auto;
	margin: 2vh 5vw;
	font-family: 'Roboto Mono', monospace;
	font-size: 13px;
	border-radius: 10px;
	color: #ebebeb;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.textContainer::-webkit-scrollbar {
	width: 7px;
	height: 7px;
}
/* Track */
.textContainer::-webkit-scrollbar-track {
	background: #212121;
	border-radius: 10px;
}

/* Handle */
.textContainer::-webkit-scrollbar-thumb {
	background: rgb(0 26 26 / 1);
	border-radius: 10px;
}
/* Handle on hover */
.textContainer::-webkit-scrollbar-thumb:hover {
	background: rgb(0, 0, 0);
}
</style>
