<script lang="ts">
	interface Props {
		title?: string;
	}

	const { title = 'Carregando...' }: Props = $props();
</script>

<div class="content">
	<h2 class="title">{title}</h2>
</div>

<style>
	.content {
		text-align: center;
	}
	.title {
		font-size: 1.5rem;
	}
</style>
