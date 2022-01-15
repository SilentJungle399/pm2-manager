<template>
	<v-app dark v-show="show">
		<v-navigation-drawer
			v-model="drawer"
			:mini-variant="miniVariant"
			style="background-color: #1e1e1e"
			v-if="$store.state.loggedIn"
			clipped
			fixed
			app
		>
			<v-list>
				<v-list-item to="/" router exact>
					<v-list-item-action>
						<v-icon>mdi-apps</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Processes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-group>
					<template v-slot:activator>
						<v-list-item-action>
							<v-icon>mdi-message-outline</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title>Logs</v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item
						v-for="item in items"
						:key="item.id"
						:to="'/logs/' + item.id"
						link
					>
						<v-list-item-title
							v-text="item.title"
						></v-list-item-title>
					</v-list-item>
				</v-list-group>

				<v-list-group>
					<template v-slot:activator>
						<v-list-item-action>
							<v-icon>mdi-alert-circle-outline</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title>Errors</v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item
						v-for="item in items"
						:key="item.id"
						:to="'/errors/' + item.id"
						link
					>
						<v-list-item-title
							v-text="item.title"
						></v-list-item-title>
					</v-list-item>
				</v-list-group>
			</v-list>

			<template v-slot:append>
				<div class="pa-2">
					<v-btn
						:block="!miniVariant"
						depressed
						:icon="miniVariant"
						@click.stop="miniVariant = !miniVariant"
					>
						<v-icon
							>mdi-{{
								`chevron-${miniVariant ? 'right' : 'left'}`
							}}</v-icon
						>
					</v-btn>
				</div>
			</template>
		</v-navigation-drawer>
		<v-app-bar clipped-left fixed app>
			<v-app-bar-nav-icon
				v-if="$store.state.loggedIn"
				@click.stop="drawer = !drawer"
			/>
			<v-toolbar-title v-text="title" />
		</v-app-bar>
		<v-main>
			<v-container>
				<Nuxt />
			</v-container>
		</v-main>

		<v-snackbar v-model="sbstate" :timeout="3000">
			{{ $store.state.snackbar.text }}

			<template v-slot:action="{ attrs }">
				<v-btn
					text
					v-bind="attrs"
					@click="$store.commit('makesb', { state: false, text: '' })"
				>
					Close
				</v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>
export default {
	name: 'DefaultLayout',
	data() {
		return {
			drawer: this.$store.state.loggedIn,
			items: [],
			miniVariant: false,
			title: 'PM2 Manager',
			show: false,
		};
	},
	methods: {},
	beforeMount() {
		this.$load.start('page');
		this.show = true;
		const passw = localStorage.getItem('passw');
		if (passw) {
			this.$socket.emit('auth', passw);
		} else {
			this.$router.push('/login');
		}
	},
	sockets: {
		initProcesses(data) {
			this.$store.commit('initProcesses', data);
			this.items = data.map((item) => {
				return {
					icon: 'mdi-apps',
					title: item.name,
					id: item.id,
				};
			});
		},
		authRet(data) {
			this.$load.done();
			this.show = true;
			if (data) {
				this.$store.commit('setLoggedIn', true);
				this.drawer = true;
			}
		},
		connect() {
			console.log('Connected to WS.');
			const passw = localStorage.getItem('passw');
			if (passw) {
				this.$socket.emit('auth', passw);
			} else {
				this.$router.push('/login');
			}
		},
		disconnect() {
			this.$load.start('page');
			this.show = false;
		},
	},
	watch: {
		$route(to, from) {
			const passw = localStorage.getItem('passw');
			if (passw) {
				this.$socket.emit('auth', passw);
			} else {
				this.$router.push('/login');
			}
		},
	},
	computed: {
		sbstate: {
			get() {
				return this.$store.state.snackbar.state;
			},
			set(val) {
				this.$store.commit('makesb', {
					state: val,
					text: this.$store.state.snackbar.text,
				});
			},
		},
	},
};
</script>
