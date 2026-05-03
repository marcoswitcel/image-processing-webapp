<script lang="ts">
	import { filterSelected } from '$lib/stores/filterSelected.svelte';
	import { Modal } from '$lib/stores/modalStore';
	import { onDestroy, onMount } from 'svelte';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';

	let canvasElement: HTMLCanvasElement | null = null;
	let videoElement: HTMLVideoElement | null = null;

	let mediaStreamWidth = 0;
	let mediaStreamHeight = 0;

	let onFrameHandle = 0;
	const frames: ImageData[] = [];
	/**
	 * Quanto mais samples mais "lag" visual terá, com dois frames já dá resultado
	 */
	const temporalFramesSample = 2;

	const searchParams = new URLSearchParams(location.search);
	let debug = searchParams.get('debug')?.trim() === '1';
	let fps = 60;

	// @todo João botão de trocar câmera frontal e trazeira

	onMount(async () => {
		if (canvasElement === null || videoElement === null) return;

		const ctx = canvasElement.getContext('2d', { willReadFrequently: true });

		if (ctx === null) return;

		const permission = await navigator.permissions.query({ name: 'camera' });

		permission.addEventListener('change', () => {
			// @todo joão, avaliar como fazer uso desse recurso
			console.log('permissão mudada');
		});

		if (permission.state === 'denied') {
			Modal.alert(
				'O app não possui acesso a câmera',
				'Caso deseje usar o app será necessário liberar o acesso a câmera'
			);
			return;
		}

		if (permission.state === 'prompt') {
			const accept = await Modal.confirm(
				'É necessário conceder acesso a câmera',
				'O aplicativo irá solicitar acessoa a câmera'
			);

			if (!accept) {
				return;
			}
		}

		const userMediaPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: false });

		Modal.loading();

		const stream = await userMediaPromise;

		Modal.close();

		videoElement.srcObject = stream;
		videoElement.addEventListener('loadedmetadata', () => {
			mediaStreamWidth = videoElement?.videoWidth ?? 0;
			mediaStreamHeight = videoElement?.videoHeight ?? 0;
		});
		videoElement.play();

		onFrameHandle = requestAnimationFrame(function onFrame() {
			const width = innerWidth.current ?? 0;
			const height = innerHeight.current ?? 0;

			if (videoElement) {
				const viewRatio = width / height;
				const viewRatioInverted = height / width;
				const videoRatio = mediaStreamWidth / mediaStreamHeight;
				let sourceWidth = 0;
				let sourceHeight = 0;
				let dx = 0;
				let dy = 0;

				if (viewRatio > videoRatio) {
					sourceWidth = mediaStreamWidth;
					sourceHeight = mediaStreamWidth * viewRatioInverted;
					dy = (mediaStreamHeight - sourceHeight) / 2;
				} else {
					sourceWidth = mediaStreamHeight * viewRatio;
					sourceHeight = mediaStreamHeight;
					dx = (mediaStreamWidth - sourceWidth) / 2;
				}

				ctx.drawImage(videoElement, dx, dy, sourceWidth, sourceHeight, 0, 0, width, height);

				const time = Date.now();
				if (filterSelected.current) {
					const imageDataIn = ctx.getImageData(0, 0, width, height);

					// salvando frames
					frames.push(imageDataIn);
					if (frames.length > temporalFramesSample) frames.shift();

					// @todo João, reciclar esse buffer
					const imageDataOut = new ImageData(imageDataIn.width, imageDataIn.height);

					filterSelected.current(frames.toReversed(), imageDataOut);

					// Desenha a nova imagem no canvas
					ctx.putImageData(imageDataOut, 0, 0);
				}

				if (debug) {
					ctx.font = '24px monospace';
					ctx.fillStyle = 'red';

					if (filterSelected.current) {
						const timeEnd = Date.now();
						fps = 1000 / (timeEnd - time);
						ctx.fillText(`FPS: ${fps.toFixed(2)}`, 10, 50);
					} else {
						ctx.fillText(`FPS: auto`, 10, 50);
					}
				}
			}

			onFrameHandle = requestAnimationFrame(onFrame);
		});
	});

	onDestroy(() => {
		cancelAnimationFrame(onFrameHandle);
	});
</script>

<div class="camera-view">
	<h1 class="title">Preview</h1>
	<video class="video" bind:this={videoElement}>Seu dispositivo não possue suporte a webcam</video>
	<canvas
		class="canvas"
		bind:this={canvasElement}
		width={innerWidth.current ?? 0}
		height={innerHeight.current ?? 0}
	></canvas>
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
</style>
