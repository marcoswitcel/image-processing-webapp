<script lang="ts">
	import { resolve } from '$app/paths';
	import { EditableFilterNode } from '$lib/filter-graph';

	const nodes: EditableFilterNode[] = [];
	const node01 = new EditableFilterNode();
	const node02 = new EditableFilterNode();
	node02.x = 100;
	nodes.push(node01);
	nodes.push(node02);

	node01.out.push(node02);
	node02.in.push(node01);
	const lines = $derived(
		nodes.flatMap(node => node.out.map(out => [node, out] as  [EditableFilterNode, EditableFilterNode]))
	)
	// console.log(lines)
</script>

<div class="page">
	<h1>Editor</h1>
	<p>Pendente implementação</p>
	<svg viewBox="0 0 200 200">

		{#each lines as line (line[0].id + line[1].id )}
			<line x1={line[0].x} y1={line[0].y} x2={line[1].x} y2={line[1].y} stroke="black" stroke-width="2" />
		{/each}


		{#each nodes as node (node.id)}
			<rect x={node.x} y={node.y} width="40" height="40" />
		{/each}

	</svg>
	<a href={resolve('/')} title="Câmera">Câmera</a>
</div>

<style>
	.page {
		padding: 1em;
	}
</style>
