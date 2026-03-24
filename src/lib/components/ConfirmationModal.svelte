<script lang="ts">
	import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()

    function choose(value: boolean) {
        dispatch('close', value);
    }
</script>

<title>Modal de confirmação</title>
<p>Você confirmar?</p>

<button on:click={() => choose(false)}>Não</button>
<button on:click={() => choose(true)}>Sim</button>

<style>
</style>
