<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	const width = window.innerWidth;
	const height = window.innerWidth;

	let canvasElement: HTMLCanvasElement | null = null;
	let videoElement: HTMLVideoElement | null = null;

	onMount(async () => {
		if (canvasElement === null || videoElement === null) return;

		const ctx = canvasElement.getContext('2d');

		if (ctx === null) return;

		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
		videoElement.srcObject = stream;
		videoElement.play();
	});
</script>

<div class="app">
	<h1 class="title">Tela inicial</h1>
	<video class="video" bind:this={videoElement}>Seu dispositivo não possue suporte a webcam</video>
	<canvas class="canvas" bind:this={canvasElement} {width} {height}></canvas>
	<a class="link" href={resolve('/editor')} title="Editor">Editor</a>
</div>

<style>
	.app {
		position: relative;
	}
	.app .title {
		position: absolute;
		width: 100%;
		font-size: 2.5em;
		padding: 1em 0;
		margin: 0;
		text-align: center;
	}
	.app .canvas,
	.app .video {
		width: 100%;
		position: absolute;
	}
	.app .link {
		position: absolute;
		left: 0;
		bottom: 0;
	}
</style>
