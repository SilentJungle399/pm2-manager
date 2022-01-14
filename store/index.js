export const state = () => ({
	processes: [],
});

export const mutations = {
	addProcess(state, process) {
		state.processes.push(process);
	},
	initProcesses(state, processes) {
		state.processes = processes;
	},
};
