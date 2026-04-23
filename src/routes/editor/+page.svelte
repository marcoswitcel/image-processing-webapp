<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import NodeEditor from '$lib/components/NodeEditor.svelte';
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';

	const nodes: EditableFilterNode[] = $state([]);
	let filterNameSelected: string = $state('edge');

	function add() {
		if (filterNameSelected) {
			nodes.push(new EditableFilterNode(filterNameSelected));
		}
	}
</script>

<div class="page">
	<h1 class="title">Editor</h1>
	<a href={resolve('/')} title="Câmera" class="link">Voltar para a câmera</a>

	<NodeEditor width={innerWidth.current} height={innerHeight.current} {nodes}></NodeEditor>
	<select name="filters" id="filters" class="filter-selection" bind:value={filterNameSelected}>
		<option value="edge">Detecção de Borda</option>
		<option value="grayScale">Tons de Cinza</option>
		<option value="webcam">Webcam</option>
		<option value="ouput">Saída</option>
	</select>
	<Button label="Adicionar Filtro" onclick={() => add()}></Button>
</div>

<style>
	.page {
		padding: 0;
	}
	.title {
		position: fixed;
		font-size: 2em;
		margin: 0;
		padding: 0;
		top: 1em;
		left: 1em;
		user-select: none;
		pointer-events: none;
	}
	.link {
		position: fixed;
		left: 1em;
		bottom: 1em;
		user-select: none;
	}
	.filter-selection {
		position: fixed;
		right: 20em;
		bottom: 2em;
		padding: 1em;
		background-color: white;
		border-radius: 2px;
		cursor: pointer;
	}
	:global(.button) {
		position: fixed;
		right: 1em;
		bottom: 1em;
	}
</style>
