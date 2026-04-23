<script lang="ts">
	import {
		combinationTestFilter,
		edgeDetection,
		edgeDetectionWithGaussianBlur,
		gaussianBlur,
		gaussianBlur5x5,
		grayScale,
		luminanceGrayScale
	} from '$lib/filter';
	import Button from './Button.svelte';

	interface Props {
		close: (value?: unknown) => void;
	}

	const { close }: Props = $props();
</script>

<div class="content">
	<h2 class="title">Filtros Disponíveis</h2>

	<div class="buttons">
		<Button label="Nenhum" onclick={() => close(null)}></Button>
		<Button label="Gaussian Blur" onclick={() => close(gaussianBlur)}></Button>
		<Button label="Gaussian Blur 5x5" onclick={() => close(gaussianBlur5x5)}></Button>
		<Button label="Tons de Cinza" onclick={() => close(grayScale)}></Button>
		<Button label="Tons de Cinza / Luminance" onclick={() => close(luminanceGrayScale)}></Button>
		<Button label="Detecção de Bordas" onclick={() => close(edgeDetection)}></Button>
		<Button
			label="Detecção de Bordas com Gaussian Blur"
			onclick={() => close(edgeDetectionWithGaussianBlur)}
		></Button>
		<Button label="Teste de combinação" onclick={() => close(combinationTestFilter)}></Button>
	</div>
</div>

<style>
	.content {
		text-align: center;
	}
	.title {
		font-size: 1.5rem;
	}

	.buttons {
		display: flex;
		flex-direction: column;
	}

	:global(.buttons > .button) {
		margin: 0.2rem 0;
	}
</style>
