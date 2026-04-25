<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import FilterOptionsModal from '$lib/components/FilterOptionsModal.svelte';
	import { type FilterProcessor } from '$lib/filter';
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
	const temporalFramesSample = 3;

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

				if (filterSelected.current) {
					const imageDataIn = ctx.getImageData(0, 0, width, height);

					// salvando frames
					frames.push(imageDataIn);
					if (frames.length > temporalFramesSample) frames.shift();

					// @todo João, reciclar esse buffer
					const imageDataOut = new ImageData(imageDataIn.width, imageDataIn.height);

					filterSelected.current(imageDataIn, imageDataOut);

					// Desenha a nova imagem no canvas
					ctx.putImageData(imageDataOut, 0, 0);
				}
			}

			onFrameHandle = requestAnimationFrame(onFrame);
		});
	});

	onDestroy(() => {
		cancelAnimationFrame(onFrameHandle);
	});

	function captureAndDownload() {
		if (canvasElement === null) return;

		const link = document.createElement('a');
		link.href = canvasElement.toDataURL('image/png');

		const timeMark = new Date()
			.toISOString()
			.replace('T', '_')
			.replace(/(:|\.)/g, '-')
			.replace('Z', '');
		link.download = `capture-${timeMark}.png`;

		link.click();

		link.remove();
	}

	async function openFilterOption() {
		const filter: FilterProcessor = await Modal.open(FilterOptionsModal, { close: Modal.close });

		filterSelected.current = filter;
	}
</script>

<div class="camera-view">
	<h1 class="title">Câmera</h1>
	<video class="video" bind:this={videoElement}>Seu dispositivo não possue suporte a webcam</video>
	<canvas
		class="canvas"
		bind:this={canvasElement}
		width={innerWidth.current ?? 0}
		height={innerHeight.current ?? 0}
	></canvas>
	<button class="floaty" type="button" title="Captura" onclick={captureAndDownload}></button>
	<a class="link" href={resolve('/editor')} title="Editor">Editor</a>
	<Button label="Filtros" onclick={openFilterOption}></Button>
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
		position: fixed;
		left: 1rem;
		bottom: 1rem;
	}
	.floaty {
		position: fixed;
		left: 50%;
		transform: translateX(-50%) scale(1);
		bottom: 3rem;
		width: 5em;
		height: 5em;
		display: block;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 50%;
		border: none;
		transition: 0.2s all ease-in;
		cursor: pointer;
	}

	.floaty:active {
		transform: translateX(-50%) scale(0.85);
	}
	:global(.camera-view > .button) {
		position: fixed;
		bottom: 1em;
		right: 1em;
	}
</style>
