<template>
	<v-row justify="center" align="center">
		<v-data-table
			style="
				margin-top: 30px;
				width: -webkit-fill-available;
				margin-left: 5vw;
				margin-right: 5vw;
			"
			:headers="headers"
			:items="$store.state.processes"
			item-key="id"
			class="elevation-1"
			:loading="
				$store.state.processes
					? $store.state.processes.length === 0
					: true
			"
			loading-text="Loading... Please wait"
			:search="search"
			disable-sort
			single-expand
			:expanded.sync="expanded"
			@click:row="
				(data) =>
					expanded.length === 1 && expanded[0].id === data.id
						? (expanded = [])
						: (expanded = [data])
			"
		>
			<template v-slot:top>
				<v-text-field
					v-model="search"
					label="Search for a process"
					class="mx-4"
				></v-text-field>
			</template>
			<template v-slot:expanded-item="{ headers, item }">
				<td :colspan="headers.length">
					<br />

					<v-btn
						:disabled="item.status === 'online'"
						color="primary"
						small
						@click="validate"
					>
						Start
					</v-btn>

					<v-btn
						:disabled="item.status !== 'online'"
						color="secondary"
						small
						@click="validate"
					>
						Restart
					</v-btn>

					<v-btn
						:disabled="item.status !== 'online'"
						color="red"
						small
						@click="validate"
					>
						Stop
					</v-btn>
					<br /><br />
				</td>
			</template>
		</v-data-table>
	</v-row>
</template>

<script>
export default {
	name: 'IndexPage',
	data() {
		return {
			search: '',
			expanded: [],
			validate: () => {
				console.log('E');
			},
		};
	},
	mounted() {
		this.$load.done();
	},
	methods: {},
	computed: {
		headers() {
			return [
				{
					text: 'ID',
					align: 'start',
					value: 'id',
				},
				{
					text: 'Name',
					value: 'name',
					sortable: false,
				},
				{
					text: 'Uptime',
					value: 'uptime',
					sortable: false,
				},
				{
					text: 'Status',
					value: 'status',
					sortable: false,
				},
				{
					text: 'CPU',
					value: 'cpu',
					sortable: true,
					sort: (a, b) => {
						return parseInt(a.slice(0, -1)) >
							parseInt(b.slice(0, -1))
							? 1
							: -1;
					},
				},
				{
					text: 'Mem',
					value: 'mem',
					sortable: true,
					sort: (a, b) => {
						return parseInt(a.slice(0, -2)) >
							parseInt(b.slice(0, -2))
							? 1
							: -1;
					},
				},
				{
					text: 'User',
					value: 'user',
					sortable: false,
				},
			];
		},
	},
	methods: {},
};
</script>
