export const state = () => ({
	processes: [],
	loggedIn: false,
	snackbar: {
		state: false,
		text: '',
	},
});
export const mutations = {
	addProcess(state, process) {
		state.processes.push(process);
	},
	initProcesses(state, processes) {
		state.processes = processes;
	},
	setLoggedIn(state, loggedIn) {
		state.loggedIn = loggedIn;
	},
	makesb(state, data) {
		state.snackbar.state = data.state;
		state.snackbar.text = data.text;
	},
	getProcess(state, id) {
		return state.processes.find(process => process.pm2_env.pm_id === id);
	},
};
