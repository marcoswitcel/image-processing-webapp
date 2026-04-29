<script lang="ts">
	import { filterLabels } from '$lib/filter';
	import Button from './Button.svelte';

	interface Props {
		close: (value?: unknown) => void;
	}

	const { close }: Props = $props();
</script>

<div class="content">
	<h2 class="title">Filtros Disponíveis</h2>

	<div class="buttons">
		<Button label="Nenhum" onclick={() => close(null)}></Button>
		{#each Object.entries(filterLabels) as [key, filterProcessor] (key)}
			<Button label={key} onclick={() => close(filterProcessor)}></Button>
		{/each}
	</div>
</div>

<style>
	.content {
		text-align: center;
	}
	.title {
		font-size: 1.5rem;
	}

	.buttons {
		display: flex;
		flex-direction: column;
	}

	:global(.buttons > .button) {
		margin: 0.2rem 0;
	}
</style>
