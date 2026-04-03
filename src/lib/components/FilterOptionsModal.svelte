<script lang="ts">
	import { edgeDetection, edgeDetectionWithGaussianBlur, gaussianBlur } from "$lib/filter";
	import Button from "./Button.svelte";

    interface Props {
        close: (value?: unknown) => void
    }

    const { close }: Props  = $props();

</script>

<div class="page">
	<h1>Opções</h1>
	<p>Pendente implementação</p>
	<div>
		<Button label="Filtro de detecção de bordas" onclick={() => close(edgeDetection)}></Button>
		<Button label="Gaussian Blur" onclick={() => close(gaussianBlur)}></Button>
		<Button label="Detecção de Bordas com Gaussian Blur" onclick={() => close(edgeDetectionWithGaussianBlur)}></Button>
	</div>
	
</div>

<style>
	.page {
		padding: 1em;
	}
</style>
