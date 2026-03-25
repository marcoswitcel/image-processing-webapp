<script lang="ts">
	import { modalStore, Modal } from '$lib/stores/modalStore';
	import { fade, fly } from 'svelte/transition';

    const Component = $derived($modalStore.component);

</script>

{#if $modalStore.isOpen }
<div class="backdrop" transition:fade={{ duration: 250 }}>
    <div class="modal-content" transition:fly={{ y: 20, duration: 300 }}>
        <!-- @todo joão, não consegue entender que o close existe... -->
        <Component {...$modalStore.props} on:close={Modal.close}></Component>
    </div>
</div>
{/if}

<style>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
}
.modal-content {
    padding: 1rem;
    background-color: white;
    width: 100%;
    min-width: 300px;
    max-width: 90vw;
    height: fit-content;
}
</style>
