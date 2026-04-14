<script lang="ts">
	import { resolve } from '$app/paths';
	import NodeEditor from '$lib/components/NodeEditor.svelte';
</script>


<div class="page">
	<h1>Editor</h1>
	<p>Pendente implementação</p>
	<NodeEditor></NodeEditor>
	<a href={resolve('/')} title="Câmera">Câmera</a>
</div>

<style>
	.page {
		padding: 1em;
	}
</style>
