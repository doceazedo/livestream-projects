<script>
	import { Group } from 'three';
	import { T, forwardEventHandlers } from '@threlte/core';
	import { useGltf } from '@threlte/extras';

	export const ref = new Group();

	const gltf = useGltf('/MarioKart.glb');

	const component = forwardEventHandlers();
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
	{#await gltf}
		<slot name="fallback" />
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
			<T.Group rotation={[Math.PI / 2, 0, 0]}>
				<T.Mesh
					geometry={gltf.nodes.mt_mario.geometry}
					material={gltf.materials.mt_mario}
					castShadow
				/>
				<T.Mesh
					geometry={gltf.nodes.mt_kart_Mario_S.geometry}
					material={gltf.materials.mt_kart_Mario_S}
					castShadow
				/>
				<T.Mesh
					geometry={gltf.nodes.mt_Kart_Mario_Tire_S.geometry}
					material={gltf.materials.mt_Kart_Mario_Tire_S}
					castShadow
				/>
			</T.Group>
		</T.Group>
	{:catch error}
		<slot name="error" {error} />
	{/await}

	<slot {ref} />
</T>
