import { useGLTF } from '@react-three/drei'
import { FC } from 'react'

export const Sky: FC = () => {
	const sky = useGLTF('/3d/sky.glb')

	return (
		<mesh>
			<primitive object={sky.scene} />
		</mesh>
	)
}
