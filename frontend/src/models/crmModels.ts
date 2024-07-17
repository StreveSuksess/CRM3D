export interface ICrmTask {
	name: string,
	execution: number,
	expired?: boolean
}

export interface ICrmProject {
	name: string,
	tasks: ICrmTask[],
}