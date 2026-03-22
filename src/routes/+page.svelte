<script lang="ts">
	import { resolve } from '$app/paths';
	import { onDestroy, onMount } from 'svelte';

	const width = window.innerWidth;
	const height = window.innerHeight;

	// @todo João, deixar a width e a height responsivas as trocas de dimensão

	let canvasElement: HTMLCanvasElement | null = null;
	let videoElement: HTMLVideoElement | null = null;

	let mediaStreamWidth = 0;
	let mediaStreamHeight = 0;

	let onFrameHandle = 0;

	// @todo João introduzir confirmações

	// @todo João botão de trocar câmera frontal e trazeira

	onMount(async () => {
		if (canvasElement === null || videoElement === null) return;

		const ctx = canvasElement.getContext('2d');

		if (ctx === null) return;

		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
		videoElement.srcObject = stream;
		videoElement.addEventListener('loadedmetadata', () => {
			mediaStreamWidth = videoElement?.videoWidth ?? 0;
			mediaStreamHeight = videoElement?.videoHeight ?? 0;
		});
		videoElement.play();

		onFrameHandle = requestAnimationFrame(function onFrame() {
			if (videoElement) {
				ctx.drawImage(videoElement, 0, 0, mediaStreamWidth, mediaStreamHeight, 0, 0, width, height);
			}

			onFrameHandle = requestAnimationFrame(onFrame);
		});
	});

	onDestroy(() => {
		cancelAnimationFrame(onFrameHandle);
	});
</script>

<div class="camera-view">
	<h1 class="title">Câmera</h1>
	<video class="video" bind:this={videoElement}>Seu dispositivo não possue suporte a webcam</video>
	<canvas class="canvas" bind:this={canvasElement} {width} {height}></canvas>
	<a class="link" href={resolve('/editor')} title="Editor">Editor</a>
</div>

<style>
	.camera-view {
		position: relative;
		width: 100vw;
		height: 100vh;
	}
	.camera-view .title {
		position: absolute;
		width: 100%;
		font-size: 2.5em;
		padding: 1em 0;
		margin: 0;
		text-align: center;
		z-index: 1;
	}

	.camera-view .video {
		display: none;
	}

	.camera-view .canvas {
		width: 100%;
		position: absolute;
	}
	.camera-view .link {
		position: absolute;
		left: 1rem;
		bottom: 1rem;
	}
</style>
