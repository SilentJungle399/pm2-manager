<template>
	<v-row justify="center" align="center">
		<v-data-table
			style="
				margin-top: 30px;
				width: -webkit-fill-available;
				margin-left: 5vw;
				margin-right: 5vw;
				box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
			"
			:headers="headers"
			:items="$store.state.processes"
			item-key="id"
			:loading="
				$store.state.processes
					? $store.state.processes.length === 0
					: true
			"
			loading-text="Loading... Please wait"
			:search="search"
			single-expand
			:expanded.sync="expanded"
			@click:row="(data) => $router.push(`/process/${data.id}`)"
		>
			<template v-slot:top>
				<v-text-field
					v-model="search"
					label="Search for a process"
					class="mx-4"
				></v-text-field>
			</template>
			<!-- <template v-slot:expanded-item="{ headers, item }">
				<td :colspan="headers.length">
					
				</td>
			</template> -->
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
			];
		},
	},
	methods: {},
};
</script>
