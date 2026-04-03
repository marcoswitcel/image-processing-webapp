<script>
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import { filterEdgeDetectionV2 } from '$lib/filter';
	import { filterSelected } from '$lib/stores/filterSelected.svelte';

	const set = () => { 
		filterSelected.current = filterEdgeDetectionV2;
	};
</script>

<div class="page">
	<h1>Editor</h1>
	<p>Pendente implementação</p>
	<div>
		<Button label="Filtro de detecção de bordas" onclick={set}></Button>
	</div>
	<a href={resolve('/')} title="Câmera">Câmera</a>
</div>

<style>
	.page {
		padding: 1em;
	}
</style>
