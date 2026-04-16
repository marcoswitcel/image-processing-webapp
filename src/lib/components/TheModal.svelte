<script lang="ts">
	import { modalStore, Modal } from '$lib/stores/modalStore';
	import { fade, fly } from 'svelte/transition';

	const Component = $derived($modalStore.component);
</script>

{#if $modalStore.isOpen}
	<div class="backdrop" transition:fade={{ duration: 250 }}>
		<div class="modal-content" transition:fly={{ y: 20, duration: 300 }}>
			<Component {...$modalStore.props} close={Modal.close}></Component>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
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
		min-width: 300px;
		max-height: 90vh;
		max-width: 90vw;
		height: fit-content;
		overflow: hidden;
		border-radius: var(--border-radius-global);
		box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
	}
</style>
