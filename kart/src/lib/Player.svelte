<script lang="ts">
	import { CapsuleGeometry, Euler, Object3D, Vector3 } from 'three';
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { RigidBody, CollisionGroups, Collider } from '@threlte/rapier';
	import { SvelteComponent, createEventDispatcher, onMount } from 'svelte';
	import Controller from './ThirdPersonControls.svelte';
	import { spring } from 'svelte/motion';
	import MarioKart from '$lib/models/MarioKart.svelte';
	import { OrbitControls } from '@threlte/extras';

	export let player;
	export let position = spring({ x: 0, y: 1, z: 5 });
	export let radius = 1;
	export let height = 1.7;
	export let speed = 6;

	const MOVE_SPEED = 8;
	const ACCELERATION = 0.05;

	let rigidBody: any;
	let camera: Object3D;
	let kart: Object3D;

	let x = 0;
	let z = 0;
	let rotation = spring(0);
	let camRotation = spring(0, { stiffness: 0.1 });

	const dispatch = createEventDispatcher();

	let grounded = false;
	$: grounded ? dispatch('groundenter') : dispatch('groundexit');

	useFrame(() => {
		if (!rigidBody) return;

		// handle kart rotation
		if (z != 0) rotation.set($rotation + (x / MOVE_SPEED) * -1);
		camRotation.set($rotation);

		const direction = new Vector3(0, 0, z).applyEuler(kart.rotation.clone());
		const velocity = rigidBody.linvel();
		rigidBody.applyImpulse(
			{
				x: (direction.x * MOVE_SPEED - velocity.x) * ACCELERATION,
				y: 0,
				z: (direction.z * MOVE_SPEED - velocity.z) * ACCELERATION
			},
			true
		);

		// when body position changes update camera position
		const pos = rigidBody.translation();
		position.set({ x: pos.x, y: pos.y, z: pos.z });
	});

	function onKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 's':
				z = 1;
				break;
			case 'w':
				z = -1;
				break;
			case 'a':
				x = -1;
				break;
			case 'd':
				x = 1;
				break;
			default:
				break;
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		switch (e.key) {
			case 's':
				z = 0;
				break;
			case 'w':
				z = 0;
				break;
			case 'a':
				x = 0;
				break;
			case 'd':
				x = 0;
				break;
			default:
				break;
		}
	}

	onMount(() => {
		window.test = () => console.log({ cameraPos });
	});

	$: cameraPos = [$position.x, $position.y + 1, $position.z + 5];
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} on:keyup={onKeyUp} />

<T.Group bind:ref={player} position={[$position.x, $position.y, $position.z]} rotation.y={Math.PI}>
	<T.Group>
		<RigidBody bind:rigidBody>
			<CollisionGroups groups={[0]}>
				<Collider shape={'ball'} args={[radius]} />
			</CollisionGroups>
		</RigidBody>
	</T.Group>
	<T.Group bind:ref={kart} rotation.y={$rotation}>
		<MarioKart />
	</T.Group>
	<T.Group rotation.y={$camRotation}>
		<T.PerspectiveCamera
			bind:ref={camera}
			makeDefault
			fov={90}
			position={[0, 1, -5]}
			rotation.y={Math.PI}
		/>
	</T.Group>
</T.Group>
