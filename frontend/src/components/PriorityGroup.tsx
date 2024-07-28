import { Dispatch, FC } from 'react'
import { IResponseTask } from '../models/responseModels.ts'
import { Vector3 } from 'three'
import { ProjectSphere } from './ProjectSphere.tsx'

type Props = {
	priority: number,
	projects: IResponseTask[],
	lookVector: Vector3 | null | undefined,
	setLookVector: Dispatch<Vector3>
}

const PriorityGroup: FC<Props> = (props) => {
	return (
		<>
			{
				props.projects.map((project, index) => <ProjectSphere zCoordinate={-(props.priority - 1) * 3} key={index}
																															crmLength={props.projects.length}
																															index={index} setLookVector={props.setLookVector}
																															text={project.task} tasks={project.tasks}
																															lookVector={props.lookVector} />)

			}
		</>
	)
}


export default PriorityGroup