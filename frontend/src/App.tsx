import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FC, useState } from 'react'
import { Vector3 } from 'three'
import { ProjectSphere } from './components/ProjectSphere.tsx'
import axios from 'axios'
import { useQuery } from 'react-query'
import { IResponseTask } from './models/responseModels.ts'
import { Sky } from './3dModels/Sky.tsx'

const App: FC = () => {
	const [lookVector, setLookVector] = useState<Vector3 | null>()
	const { isLoading, error, data: crmData } = useQuery<IResponseTask[]>(
		'data',
		() =>
			axios.get(import.meta.env.VITE_API_URL).then(res => {
				console.log(res.data)
				return res.data
			})
	)

	if (isLoading) return <p>Loading...</p>
	if (error) return <p>
		{error.toString()}
	</p>
	return (
		<Canvas
			camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}
		>
			<Sky />
			<OrbitControls
				enablePan={true}
				ref={(controls) => {
					if (!controls) return
					controls.maxDistance = 10
					if (!lookVector) return
					controls.target = lookVector
					controls.zoom0 = 0.1
					controls.minDistance = 1
					controls.maxDistance = 2
					setTimeout(() => {
						controls.maxDistance = 10
					}, 10)
				}}
			/>
			<directionalLight position={[1, 1, 1]} intensity={1} />
			<ambientLight intensity={0.7} />
			<pointLight position={[10, 5, 10]} intensity={2} />
			{crmData &&
				crmData.map((project, index) => {
					return (
						<ProjectSphere lookVector={lookVector} text={project.task} tasks={project.tasks}
													 setLookVector={setLookVector}
													 key={index}
													 index={index} />
					)
				})}


		</Canvas>
	)
}

export default App
