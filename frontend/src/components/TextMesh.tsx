import { extend, useFrame, useThree } from '@react-three/fiber'
// @ts-ignore
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FC, useRef } from 'react'
import { Mesh, MeshBasicMaterial, Vector3 } from 'three'
// @ts-ignore
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import JSONfont from '../assets/roboto.json'

extend({ TextGeometry })

type Props = {
	position: Vector3 | undefined,
	text: string,
	scale: number
}

export const TextMesh: FC<Props> = (props) => {
	const textRef = useRef<Mesh | null>(null)
	const { camera } = useThree()

	useFrame(() => {
		if (!textRef.current) return
		textRef.current.lookAt(camera.position)
	})

	const font = new FontLoader().parse(JSONfont)
	const textGeometry = new TextGeometry(props.text, {
		font,
		fontSize: 1,
		fontWeight: 'bold',
		depth: 0
	})
	const textMaterial = new MeshBasicMaterial({ color: 0x000 })

	return (
		<mesh ref={textRef} geometry={textGeometry} scale={props.scale} material={textMaterial} position={props.position} />
	)
}