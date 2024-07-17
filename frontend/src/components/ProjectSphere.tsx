import { Dispatch, FC, useEffect, useRef, useState } from 'react'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { TextMesh } from './TextMesh.tsx'
import { Sphere } from '@react-three/drei'
import { TaskSphere } from './TaskSphere.tsx'
import { IResponseTask } from '../models/responseModels.ts'

export const ProjectSphere: FC<{
	index: number,
	setLookVector: Dispatch<Vector3>,
	text: IResponseTask['task'],
	tasks: IResponseTask['tasks'],
	lookVector: Vector3 | null | undefined,
}> = (props) => {
	const sphereRef = useRef<Mesh | null>(null)
	const [opacity, setOpacity] = useState<number>(0.7)
	const [textPosition, setTextPosition] = useState<Vector3>()

	useFrame(() => {
		setOpacity(sphereRef.current && sphereRef.current.position === props.lookVector ? 0.1 : 0.7)
	})

	useEffect(() => {
		if (!sphereRef.current) return
		setTextPosition(sphereRef.current ? new Vector3(-props.text.length / 10, sphereRef.current.position.y + (props.index % 2 === 0 ? 1.5 : 1), sphereRef.current.position.z) : new Vector3(0, 0, 0))
	}, [sphereRef.current, sphereRef.current?.position.x])

	return (
		<>
			<Sphere
				args={[1, 128, 128]}
				ref={sphereRef}
				onDoubleClick={() => {
					if (!sphereRef.current) return
					props.setLookVector(sphereRef.current.position)
				}}
				position={[props.index * 3 - 3, 0, 0]}>
				<TextMesh text={props.text}
									position={textPosition}
									scale={0.003}
				/>
				<meshStandardMaterial
					color="#87CEEB" opacity={opacity} transparent />
				{
					props.tasks &&
					props.tasks.map((task, index) => <TaskSphere
						key={index}
						index={index}
						position={new Vector3(sphereRef.current ? sphereRef.current?.position.x * 0.05 + ((index - (props.tasks?.length || 0) / 3) * 0.4) : ((index - (props.tasks?.length || 0)) * 0.4), 0, 0)} {...task} />)
				}
			</Sphere>
		</>
	)
}