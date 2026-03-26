<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Button from "./Button.svelte";

    interface Props {
        title: string;
        description: string;
    }

    const { title, description }: Props  = $props();

    const dispatch = createEventDispatcher()

    function choose(value: boolean) {
        dispatch('close', value);
    }
</script>

<div class="content">
    <h2 class="title">{title}</h2>
    {#if  description}
        <p class="description">{description}?</p>
    {/if}
    
    <div class="buttons">
        <Button onclick={() => choose(false)} label="Não"></Button>
        <Button onclick={() => choose(true)} label="Sim"></Button>
    </div>
</div>

<style>
.content {
    text-align: center;
}
.title {
    font-size: 1.5rem;
}
.description {
    font-size: 1rem;
}
</style>
