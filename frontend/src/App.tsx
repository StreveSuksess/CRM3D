import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FC, useState } from 'react'
import { Vector3 } from 'three'
import axios from 'axios'
import { useQuery } from 'react-query'
import { IResponseData } from './models/responseModels.ts'
import { Sky } from './3dModels/Sky.tsx'
import PriorityGroup from './components/PriorityGroup.tsx'

const App: FC = () => {
	const [lookVector, setLookVector] = useState<Vector3 | null>()
	const { isLoading, error, data: crmData } = useQuery<IResponseData>(
		'data',
		() =>
			axios.get(import.meta.env.VITE_API_URL).then(res => {
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
					controls.maxDistance = 20
					if (!lookVector) return
					controls.target = lookVector
					controls.zoom0 = 0.1
					controls.minDistance = 1
					controls.maxDistance = 2
					setTimeout(() => {
						controls.maxDistance = 20
					}, 10)
				}}
			/>
			<directionalLight position={[1, 1, 1]} intensity={1} />
			<ambientLight intensity={0.7} />
			<pointLight position={[10, 5, 10]} intensity={2} />
			{crmData &&
				Object.keys(crmData).map((priority) => {
					const projects = crmData[+priority]

					return <PriorityGroup priority={+priority} lookVector={lookVector} setLookVector={setLookVector}
																projects={projects} />
				})
			}


		</Canvas>
	)
}

export default App
