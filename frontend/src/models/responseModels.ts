export interface IResponseTask {
	id: number;
	task: string;
	description: string;
	active: 0 | 1;
	deadline: string;
	created_by: string;
	assignee: string;
	participants: string;
	observers: string;
	status: string;
	project_id: number;
	created_on: string;
	start_date: string;
	modified_on: string;
	closed_on: null | string;
	planned_duration: number;
	track_time_spent: 0 | 1;
	score: number;
	responsible_person_can_change_deadline: 0 | 1;
	time_spent: number;
	tags: string;
	lead: string;
	contact: string;
	company: string;
	deal: string;
	crm: string;
	parent_task_id: null | number;
	parent_task_name: null | string;
	flow: string;
	percentage_completion: number;
	tasks?: IResponseTask[]
}