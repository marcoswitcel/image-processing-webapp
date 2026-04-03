<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import type { FilterProcessor } from '$lib/filter';
	import { edgeDetection, edgeDetectionWithGaussianBlur, gaussianBlur } from '$lib/filter';
	import { filterSelected } from '$lib/stores/filterSelected.svelte';

	const set = (filter: FilterProcessor) => { 
		filterSelected.current = filter;
	};
</script>

<div class="page">
	<h1>Editor</h1>
	<p>Pendente implementação</p>
	<div>
		<Button label="Filtro de detecção de bordas" onclick={() => set(edgeDetection)}></Button>
		<Button label="Gaussian Blur" onclick={() => set(gaussianBlur)}></Button>
		<Button label="Detecção de Bordas com Gaussian Blur" onclick={() => set(edgeDetectionWithGaussianBlur)}></Button>
	</div>
	<a href={resolve('/')} title="Câmera">Câmera</a>
</div>

<style>
	.page {
		padding: 1em;
	}
</style>
