<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import TheModal from '$lib/components/TheModal.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-container">
	{@render children()}
</div>

<TheModal />
