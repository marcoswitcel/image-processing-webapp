<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import NodeEditor from '$lib/components/NodeEditor.svelte';
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';

	const nodes: EditableFilterNode[] = $state([]);

	function add() {
		nodes.push(new EditableFilterNode());
	}
</script>

<div class="page">
	<h1 class="title">Editor</h1>
	<a href={resolve('/')} title="Câmera" class="link">Voltar para a câmera</a>

	<NodeEditor width={innerWidth.current} height={innerHeight.current} {nodes}></NodeEditor>
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
	:global(.button) {
		position: fixed;
		right: 1em;
		bottom: 1em;
	}
</style>
