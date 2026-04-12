<script lang="ts">
	import { resolve } from '$app/paths';
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';

	const lineWidth = 3;
	const borderRadius = 6;

	const nodes: EditableFilterNode[] = $state([
		new EditableFilterNode(),
		new EditableFilterNode()
	]);
	nodes[1].x = 300;

	nodes[0].out.push(nodes[1]);
	nodes[1].in.push(nodes[0]);

	const lines = $derived(
		nodes.flatMap(node => node.out.map(out => [node, out] as  [EditableFilterNode, EditableFilterNode]))
	)

	let offsetX = 0;
	let offsetY = 0;
	let dragging = false;
	let editableSelected: EditableFilterNode | null = $state(null);

	function handleMouseDown(editable: EditableFilterNode, event: MouseEvent) {
		offsetX = event.screenX;
		offsetY = event.screenY;
		editableSelected = editable;
		dragging = true;
	}

	function handleMouseUp() {
		dragging = false;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!dragging || editableSelected == null) return;
		
		const deltaX = event.screenX - offsetX;
		const deltaY = event.screenY - offsetY;

		offsetX = event.screenX;
		offsetY = event.screenY;

		editableSelected.x += deltaX;
		editableSelected.y += deltaY;
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp}></svelte:window>

<div class="page">
	<h1>Editor</h1>
	<p>Pendente implementação</p>
	<svg viewBox="0 0 600 600">

		{#each lines as line (line[0].id + line[1].id )}
			<line x1={line[0].x} y1={line[0].y} x2={line[1].x} y2={line[1].y} stroke="black" stroke-width={lineWidth} />
		{/each}


		{#each nodes as node (node.id)}
			<rect fill="green" x={node.x} y={node.y} width="100" height="100" rx={borderRadius} ry={borderRadius} onmousedown={(event) => handleMouseDown(node, event)} />
		{/each}

	</svg>
	<a href={resolve('/')} title="Câmera">Câmera</a>
</div>

<style>
	.page {
		padding: 1em;
	}
	svg {
		width: 600px;
		border: 1px dotted black;
		user-select: none;
	}
</style>
