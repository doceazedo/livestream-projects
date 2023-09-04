<script>
	import { T } from '@threlte/core';
	import { AutoColliders, CollisionGroups, Debug } from '@threlte/rapier';
	import { BoxGeometry, MeshStandardMaterial } from 'three';
	import Player from './Player.svelte';

	let player;
</script>

<T.DirectionalLight castShadow position={[8, 20, -3]} target={player} />
<T.AmbientLight intensity={0.2} />

<Debug />

<T.GridHelper args={[50]} position.y={0.01} />

<CollisionGroups groups={[0, 15]}>
	<AutoColliders shape={'cuboid'} position={[0, -0.5, 0]}>
		<T.Mesh
			receiveShadow
			geometry={new BoxGeometry(100, 1, 100)}
			material={new MeshStandardMaterial()}
		/>
	</AutoColliders>
</CollisionGroups>

<CollisionGroups groups={[0]}>
	<!-- position={{ x: 2 }} -->
	<Player bind:player />
</CollisionGroups>
