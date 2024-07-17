import { FC, useEffect, useRef, useState } from 'react'
import { GradientTexture, Sphere } from '@react-three/drei'
import { TextMesh } from './TextMesh.tsx'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { IResponseTask } from '../models/responseModels.ts'

interface Props extends IResponseTask {
	index: number
	position: Vector3
}

export const TaskSphere: FC<Props> = (props) => {
	const [textPosition, setTextPosition] = useState<Vector3>()
	const sphereRef = useRef<Mesh | null>(null)
	const [shake, setShake] = useState<number>(0)

	useFrame(() => {
		if (!sphereRef.current || new Date(props.deadline) >= new Date()) return
		setShake(Math.sin(Date.now() * 0.05) * 0.01)
		sphereRef.current.position.x = shake + props.position.x
	})

	useEffect(() => {
		if (!sphereRef.current) return
		setTextPosition(sphereRef.current ? new Vector3(sphereRef.current.position.x - props.task.length / 100, sphereRef.current.position.y + (props.index % 2 === 0 ? 0.15 * 1.5 : 0.15), sphereRef.current.position.z) : new Vector3(0, 0, 0))
	}, [sphereRef.current, props.position.x, shake])

	return (
		<>
			<TextMesh text={props.task}
								position={textPosition}
								scale={0.0003} />
			<Sphere position={props.position} ref={sphereRef} scale={0.1}>
				<meshBasicMaterial>
					<GradientTexture
						stops={[1 - +props.score / 100, 1 - +props.score / 100, 1]}
						colors={(new Date(props.deadline) < new Date()) ? ['red', 'red', 'red'] : +props.score === 100 ? ['green', 'green', 'green'] : ['black', 'white', 'black']}
						size={1024}
					/>
				</meshBasicMaterial>
			</Sphere>
		</>
	)
}