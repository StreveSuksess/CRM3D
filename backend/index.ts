import express from 'express'
import mariadb from 'mariadb'

const app = express()
const port = 3001

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})
app.use(express.json())

const pool = mariadb.createPool({
	host: '46.41.138.152',
	user: 'xyz',
	password: '38djmqxh!%',
	database: 'PROJECTX01'
})

app.get('/data', async (req, res) => {
	let conn

	try {
		conn = await pool.getConnection()
		let rows = await conn.query('SELECT * FROM tasks')
		let data: Task[] = rows.map((obj: any) => {
			return Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value])
			)
		})

		const parentObjs: { [key: number]: Task[] } = {}
		data.forEach(task => {
			if (!task.parent_task_id) return

			if (task.parent_task_id in parentObjs) {
				parentObjs[task.parent_task_id].push(task)
			} else {
				parentObjs[task.parent_task_id] = [task]
			}

			data = data.filter(obj => obj.parent_task_id !== task.parent_task_id)
		})

		data = data.map(task => {
			if (!(task.id in parentObjs)) return task
			task.tasks = parentObjs[task.id]
			return task
		})

		const prioritiesData: Tasks = {}

		data.forEach(task => {
			if (task.priority in prioritiesData) {
				prioritiesData[task.priority].push(task)
			} else {
				prioritiesData[task.priority] = [task]
			}
		})

		res.json(prioritiesData)
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) await conn.end()
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

interface Task {
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
	priority: number;
	tasks?: Task[]
}

type Tasks = {
	[key: string]: Task[]
};
