<template>
	<v-app dark>
		<v-navigation-drawer
			v-model="drawer"
			:mini-variant="miniVariant"
			style="background-color: #1e1e1e"
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

				<v-list-group :value="false" no-action sub-group>
					<template v-slot:activator>
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
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title v-text="title" />
		</v-app-bar>
		<v-main>
			<v-container>
				<Nuxt />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: 'DefaultLayout',
	data() {
		return {
			drawer: true,
			items: [],
			miniVariant: false,
			title: 'PM2 Manager',
		};
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
	},
};
</script>
