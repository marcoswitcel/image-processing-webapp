<script lang="ts">
	import { resolve } from '$app/paths';
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';

	const nodes: EditableFilterNode[] = $state([
		new EditableFilterNode(),
		new EditableFilterNode()
	]);
	nodes[1].x = 100;

	nodes[0].out.push(nodes[1]);
	nodes[1].in.push(nodes[0]);

	const lines = $derived(
		nodes.flatMap(node => node.out.map(out => [node, out] as  [EditableFilterNode, EditableFilterNode]))
	)

	let offsetX = 0;
	let offsetY = 0;
	let dragging = false;

	function handleMouseDown(event: MouseEvent) {
		offsetX = event.screenX;
		offsetY = event.screenY;
		dragging = true;
	}

	function handleMouseUp() {
		dragging = false;
	}

	function handleMouseMove(editable: EditableFilterNode, event: MouseEvent) {
		if (!dragging) return;
		
		const deltaX = event.screenX - offsetX;
		const deltaY = event.screenY - offsetY;

		offsetX = event.screenX;
		offsetY = event.screenY;

		editable.x += deltaX;
		editable.y += deltaY;
	}
</script>

<div class="page">
	<h1>Editor</h1>
	<p>Pendente implementação</p>
	<svg viewBox="0 0 200 200">

		{#each lines as line (line[0].id + line[1].id )}
			<line x1={line[0].x} y1={line[0].y} x2={line[1].x} y2={line[1].y} stroke="black" stroke-width="2" />
		{/each}


		{#each nodes as node (node.id)}
			<rect x={node.x} y={node.y} width="40" height="40" onmousedown={handleMouseDown} onmouseup={handleMouseUp} onmousemove={(event) => handleMouseMove(node, event)} />
		{/each}

	</svg>
	<a href={resolve('/')} title="Câmera">Câmera</a>
</div>

<style>
	.page {
		padding: 1em;
	}
</style>
