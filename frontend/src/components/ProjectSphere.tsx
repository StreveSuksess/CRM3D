import { Dispatch, FC, useEffect, useMemo, useRef, useState } from 'react'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { TextMesh } from './TextMesh.tsx'
import { Sphere } from '@react-three/drei'
import { TaskSphere } from './TaskSphere.tsx'
import { IResponseTask } from '../models/responseModels.ts'
import { addLineBreaks, countChars } from '../utils.ts'
import { TPositions } from '../models/positionModel.ts'


type Props = {
	crmLength: number,
	index: number,
	setLookVector: Dispatch<Vector3>,
	text: IResponseTask['task'],
	tasks: IResponseTask['tasks'],
	lookVector: Vector3 | null | undefined,
	zCoordinate: number,
}

export const ProjectSphere: FC<Props> = (props) => {
	const sphereRef = useRef<Mesh | null>(null)
	const [opacity, setOpacity] = useState<number>(0.7)
	const [textPosition, setTextPosition] = useState<Vector3>()

	useFrame(() => {
		setOpacity(sphereRef.current && sphereRef.current.position === props.lookVector ? 0.1 : 0.7)
	})

	useEffect(() => {
		if (!sphereRef.current) return
		console.log(sphereRef.current.position.z)
		setTextPosition(sphereRef.current ? new Vector3(-0.85, (countChars(addLineBreaks(props.text), '\n')) * 0.5 + 1.2, sphereRef.current.position.z / 100) : new Vector3(0, 0, 0))
	}, [sphereRef.current, sphereRef.current?.position.x, sphereRef.current?.position.z])


	const spherePositions: Vector3[] = useMemo(() => {
		const positions: Vector3[] = []
		for (let i = 0; i < props.crmLength; i++) {
			const angle: number = (i / props.crmLength) * Math.PI * 2
			const x: number = Math.cos(angle)
			const y: number = Math.sin(angle)
			positions.push(new Vector3(x * props.crmLength / 2, y * props.crmLength / 2, 0))
		}
		return positions
	}, [props.crmLength])

	const positions: TPositions = {
		1: {
			0: [0, 0, props.zCoordinate]
		},
		2: {
			0: [-2, 0, props.zCoordinate],
			1: [2, 0, props.zCoordinate]
		},
		3: {
			0: [-2, -1, props.zCoordinate],
			1: [2, -1, props.zCoordinate],
			2: [0, 1, props.zCoordinate]
		},
		4: {
			0: [-2, -2, props.zCoordinate],
			1: [2, -2, props.zCoordinate],
			2: [-2, 2, props.zCoordinate],
			3: [2, 2, props.zCoordinate]
		},
		5: {
			0: [-3, -2, props.zCoordinate],
			1: [3, -2, props.zCoordinate],
			2: [-3, 2, props.zCoordinate],
			3: [3, 2, props.zCoordinate],
			4: [0, 0, props.zCoordinate]
		},
		6: {
			0: [-3, -2, props.zCoordinate],
			1: [0, -2, props.zCoordinate],
			2: [3, -2, props.zCoordinate],
			3: [-3, 2, props.zCoordinate],
			4: [0, 2, props.zCoordinate],
			5: [3, 2, props.zCoordinate]
		},
		7: {
			0: [-1.5, -3, props.zCoordinate],
			1: [1.5, -3, props.zCoordinate],
			2: [-3, 0, props.zCoordinate],
			3: [0, 0, props.zCoordinate],
			4: [3, 0, props.zCoordinate],
			5: [-1.5, 3, props.zCoordinate],
			6: [1.5, 3, props.zCoordinate]
		},
		8: {
			0: [-3, -3, props.zCoordinate],
			1: [0, -3, props.zCoordinate],
			2: [3, -3, props.zCoordinate],
			3: [-3, 0, props.zCoordinate],
			4: [0, 0, props.zCoordinate],
			5: [3, 0, props.zCoordinate],
			6: [-1.5, 3, props.zCoordinate],
			7: [1.5, 3, props.zCoordinate]
		},
		9: {
			0: [-3, -3, props.zCoordinate],
			1: [0, -3, props.zCoordinate],
			2: [3, -3, props.zCoordinate],
			3: [-3, 0, props.zCoordinate],
			4: [0, 0, props.zCoordinate],
			5: [3, 0, props.zCoordinate],
			6: [-3, 3, props.zCoordinate],
			7: [0, 3, props.zCoordinate],
			8: [3, 3, props.zCoordinate]
		}
	}

	return (
		<>
			<Sphere
				args={[1, 100, 100]}
				ref={sphereRef}
				onDoubleClick={() => {
					if (!sphereRef.current) return
					props.setLookVector(sphereRef.current.position)
				}}
				position={props.crmLength > 9 ? spherePositions[props.index] : new Vector3(...positions[props.crmLength][props.index])}>
				<TextMesh text={addLineBreaks(props.text)}
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
						projectPosition={sphereRef.current?.position || new Vector3(0, 0, 0)}
						tasksLength={props.tasks?.length || 0}
						{...task} />)
				}
			</Sphere>
		</>
	)
}