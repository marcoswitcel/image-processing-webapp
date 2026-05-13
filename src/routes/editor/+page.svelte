<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import CameraPreview from '$lib/components/CameraPreview.svelte';
	import NodeEditor from '$lib/components/NodeEditor.svelte';
	import { filtersInfo } from '$lib/filter';
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';

	const nodes: EditableFilterNode[] = $state([]);
	let filterNameSelected: string = $state('webcam');

	function add() {
		if (filterNameSelected) {
			nodes.push(new EditableFilterNode(filterNameSelected));
		}
	}

	// @todo João, pensar em como vincular essas duas janelas
	// window.open(resolve('/'), 'View', 'width=600,height=400');
</script>

<div class="page">
	<h1 class="title">Editor</h1>
	<a href={resolve('/')} title="Câmera" class="link">Voltar para a câmera</a>

	<NodeEditor width={innerWidth.current} height={innerHeight.current} {nodes}></NodeEditor>
	<select name="filters" id="filters" class="filter-selection" bind:value={filterNameSelected}>
		<option value="webcam">Webcam</option>
		<option value="ouput">Saída</option>
		{#each filtersInfo as filter (filter.filterName)}
			<option value={filter.filterName}>{filter.description}</option>
		{/each}
	</select>
	<Button label="Adicionar Filtro" onclick={() => add()}></Button>
	<CameraPreview
		innerWidth={(innerWidth.current ?? 0) * 0.5}
		innerHeight={(innerWidth.current ?? 0) * 0.35}
	></CameraPreview>
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
	:global(.page .button) {
		position: fixed;
		right: 1em;
		bottom: 1em;
	}
	:global(.page .camera-view) {
		position: fixed;
		right: 0;
		top: 0;
		z-index: -1;
	}
</style>
