<template>
	<v-container grid-list-xs>
		<v-layout text-center wrap>
			<v-flex mb-5 xs12 style="margin-top: 30px">
				<v-text-field
					v-model="passw"
					label="Password"
					outlined
					type="password"
					style="max-width: 500px; margin: auto; margin-top: 20vh"
					class="rounded-md"
					@keypress.enter="validate"
				></v-text-field>

				<v-btn :disabled="!passw" color="primary" @click="validate">
					Login
				</v-btn>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
export default {
	data() {
		return {
			passw: '',
		};
	},
	methods: {
		validate() {
			this.$socket.emit('auth', this.passw);
		},
	},
	mounted() {
		this.$load.done();
	},
	sockets: {
		authRet(data) {
			if (!data) {
				this.$store.commit('makesb', {
					state: true,
					text: 'Invalid password!',
				});
			} else {
				this.$store.commit('makesb', {
					state: true,
					text: 'Logged in...',
				});
				localStorage.setItem('passw', this.passw);
				this.$store.commit('setLoggedIn', true);
				this.$router.push('/');
			}
		},
	},
};
</script>
