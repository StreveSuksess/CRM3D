import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { GradientTexture, Sphere } from '@react-three/drei'
import { TextMesh } from './TextMesh.tsx'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { IResponseTask } from '../models/responseModels.ts'
import { addLineBreaks, countChars } from '../utils.ts'
import { TPositions } from '../models/positionModel.ts'

const positions: TPositions = {
	1: {
		0: [0, 0, 0]
	},
	2: {
		0: [-0.2, 0, 0],
		1: [0.2, 0, 0]
	},
	3: {
		0: [-0.2, -0.1, 0],
		1: [0.2, -0.1, 0],
		2: [0, 0.1, 0]
	},
	4: {
		0: [-0.2, -0.2, 0],
		1: [0.2, -0.2, 0],
		2: [-0.2, 0.2, 0],
		3: [0.2, 0.2, 0]
	},
	5: {
		0: [-0.3, -0.2, 0],
		1: [0.3, -0.2, 0],
		2: [-0.3, 0.2, 0],
		3: [0.3, 0.2, 0],
		4: [0, 0, 0]
	},
	6: {
		0: [-0.3, -0.2, 0],
		1: [0, -0.2, 0],
		2: [0.3, -0.2, 0],
		3: [-0.3, 0.2, 0],
		4: [0, 0.2, 0],
		5: [0.3, 0.2, 0]
	},
	7: {
		0: [-0.15, -0.3, 0],
		1: [0.15, -0.3, 0],
		2: [-0.3, 0, 0],
		3: [0, 0, 0],
		4: [0.3, 0, 0],
		5: [-0.15, 0.3, 0],
		6: [0.15, 0.3, 0]
	},
	8: {
		0: [-0.3, -0.3, 0],
		1: [0, -0.3, 0],
		2: [0.3, -0.3, 0],
		3: [-0.3, 0, 0],
		4: [0, 0, 0],
		5: [0.3, 0, 0],
		6: [-0.15, 0.3, 0],
		7: [0.15, 0.3, 0]
	},
	9: {
		0: [-0.3, -0.3, 0],
		1: [0, -0.3, 0],
		2: [0.3, -0.3, 0],
		3: [-0.3, 0, 0],
		4: [0, 0, 0],
		5: [0.3, 0, 0],
		6: [-0.3, 0.3, 0],
		7: [0, 0.3, 0],
		8: [0.3, 0.3, 0]
	}
}

interface Props extends IResponseTask {
	index: number,
	projectPosition: Vector3,
	tasksLength: number
}

export const TaskSphere: FC<Props> = (props) => {
	const [textPosition, setTextPosition] = useState<Vector3>()
	const sphereRef = useRef<Mesh | null>(null)
	const shake = 0

	useFrame(() => {
		if (!sphereRef.current || new Date(props.deadline) >= new Date()) return
		// setShake(Math.sin(Date.now() * 0.05) * 0.01)
		// sphereRef.current.position.x = shake + props.position.x
	})

	useEffect(() => {
		if (!sphereRef.current) return
		setTextPosition(sphereRef.current ? new Vector3(sphereRef.current.position.x - 0.085, sphereRef.current.position.y + countChars(addLineBreaks(props.task), '\n') / 20 + 0.15, sphereRef.current.position.z) : new Vector3(0, 0, 0))
	}, [sphereRef.current, props.projectPosition.x, shake])

	const spherePositions: Vector3[] = useMemo(() => {
		const positions: Vector3[] = []
		for (let i = 0; i < props.tasksLength; i++) {
			const angle: number = (i / props.tasksLength) * Math.PI * 2
			const x: number = Math.cos(angle)
			const y: number = Math.sin(angle)
			positions.push(new Vector3(props.projectPosition.x + x * props.tasksLength / 20, props.projectPosition.y + y * props.tasksLength / 20, props.projectPosition.z))
		}
		return positions
	}, [props.tasksLength])

	return (
		<>
			<TextMesh text={addLineBreaks(props.task)}
								position={textPosition}
								scale={0.0003} />
			<Sphere
				position={props.tasksLength > 9 ? spherePositions[props.index] : new Vector3(props.projectPosition.x / 25 + positions[props.tasksLength][props.index][0], props.projectPosition.y / 25 + positions[props.tasksLength][props.index][1], props.projectPosition.z + positions[props.tasksLength][props.index][2])}
				ref={sphereRef} scale={0.1}>
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