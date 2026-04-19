<script lang="ts">
	import { EditableFilterNode } from '$lib/filter-graph/index.svelte';

	interface Props {
		width?: number;
		height?: number;
		nodes: EditableFilterNode[];
	}

	const { width = 0, height = 0, nodes = $bindable() }: Props = $props();
	let svgOffsetX = $state(0);
	let svgOffsetY = $state(0);

	const viewBox = $derived(`${svgOffsetX} ${svgOffsetY} ${width} ${height}`);

	const lineWidth = 3;
	const borderRadius = 6;

	const lines = $derived(
		nodes.flatMap((node) =>
			node.out.map((out) => [node, out] as [EditableFilterNode, EditableFilterNode])
		)
	);

	let offsetX = 0;
	let offsetY = 0;
	let dragging = false;
	let isControlPressed = false;
	let editableSelected: EditableFilterNode | null = $state(null);

	function handleMouseDown(editable: EditableFilterNode, event: MouseEvent) {
		event.stopPropagation();

		offsetX = event.screenX;
		offsetY = event.screenY;

		if (editableSelected && isControlPressed) {
			editableSelected.connect(editable);
			editableSelected = null;
		} else {
			dragging = true;
			editableSelected = editable;
		}
	}

	function handleMouseUp() {
		dragging = false;
		document.body.style.cursor = '';
		if (!isControlPressed) {
			editableSelected = null;
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!dragging) return;

		const deltaX = event.screenX - offsetX;
		const deltaY = event.screenY - offsetY;

		offsetX = event.screenX;
		offsetY = event.screenY;

		if (editableSelected == null) {
			svgOffsetX -= deltaX;
			svgOffsetY -= deltaY;
		} else {
			editableSelected.x += deltaX;
			editableSelected.y += deltaY;
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			editableSelected = null;
		}

		if (event.key === 'Control') {
			isControlPressed = true;
		}
	}
	function onKeyUp(event: KeyboardEvent) {
		if (event.key === 'Control') {
			isControlPressed = false;
			editableSelected = null;
		} else if (event.code === 'KeyL') {
			console.log(editableSelected);
		}
	}
	function onBlur() {
		isControlPressed = false;
		editableSelected = null;
	}

	function handleMouseDownWindow(event: MouseEvent) {
		dragging = true;

		offsetX = event.screenX;
		offsetY = event.screenY;

		document.body.style.cursor = 'grabbing';
	}
</script>

<svelte:window
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmousedown={handleMouseDownWindow}
/>
<svelte:document onkeydown={onKeyDown} onkeyup={onKeyUp} onblur={onBlur} />

<svg {viewBox}>
	{#each lines as line (line[0].id + line[1].id)}
		<line
			x1={line[0].x}
			y1={line[0].y}
			x2={line[1].x}
			y2={line[1].y}
			stroke="black"
			stroke-width={lineWidth}
		/>
		<circle cx={line[0].x} cy={line[0].y} r={lineWidth * 2.5} fill="gray"></circle>
		<circle cx={line[1].x} cy={line[1].y} r={lineWidth * 1.5} fill="gray"></circle>
	{/each}

	{#each nodes as node (node.id)}
		<g
			role="button"
			tabindex="-1"
			onmousedown={(event) => handleMouseDown(node, event)}
			data-id={node.id}
		>
			<rect
				fill="green"
				data-id={node.id}
				data-selected={node == editableSelected}
				x={node.x}
				y={node.y}
				width="100"
				height="100"
				rx={borderRadius}
				ry={borderRadius}
			/>
			<text x={node.x + 2} y={node.y + 12} font-size="14" fill="white">{node.id.slice(0, 11)}</text>
			<text x={node.x + 2} y={node.y + 26} font-size="14" fill="white">{node.type}</text>
		</g>
	{/each}
</svg>

<style>
	svg {
		border: 1px dotted black;
		user-select: none;
	}

	g,
	rect {
		outline: none;
	}

	rect:hover {
		opacity: 0.9;
		cursor: grab;
	}
	rect[data-selected='true'] {
		opacity: 0.7;
		cursor: grabbing;
		outline: none;
	}
</style>
