<script lang="ts">
	import Button from "./Button.svelte";

    interface Props {
        title: string;
        description: string;
        close: (value: boolean) => void
    }

    const { title, description, close }: Props  = $props();

</script>

<div class="content">
    <h2 class="title">{title}</h2>
    {#if  description}
        <p class="description">{description}?</p>
    {/if}
    
    <div class="buttons">
        <Button onclick={() => close(false)} label="Não"></Button>
        <Button onclick={() => close(true)} label="Sim"></Button>
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
