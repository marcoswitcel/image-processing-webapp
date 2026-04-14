<script lang="ts">
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';

	interface Props {
        width?: number
		height?: number
		nodes: EditableFilterNode[]
    }

    const { width = 0, height = 0, nodes = $bindable() }: Props  = $props();
	const svgOffsetX = $state(0);
	const svgOffsetY = $state(0);

	const viewBox = $derived(`${svgOffsetX} ${svgOffsetY} ${width} ${height}`);

	const lineWidth = 3;
	const borderRadius = 6;

	// @todo joão, remover esse bloco quando permitir selecionar um bloco e depois o outro para estabelecer a conexão
	{
		nodes[1].x = 300;
	
		nodes[0].out.push(nodes[1]);
		nodes[1].in.push(nodes[0]);
	}

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

<svg viewBox={viewBox}>

    {#each lines as line (line[0].id + line[1].id )}
        <line x1={line[0].x} y1={line[0].y} x2={line[1].x} y2={line[1].y} stroke="black" stroke-width={lineWidth} />
    {/each}


    {#each nodes as node (node.id)}
        <rect fill="green" x={node.x} y={node.y} width="100" height="100" rx={borderRadius} ry={borderRadius} onmousedown={(event) => handleMouseDown(node, event)} />
    {/each}

</svg>

<style>
	svg {
		border: 1px dotted black;
		user-select: none;
	}
</style>
