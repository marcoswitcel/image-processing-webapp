<script lang="ts">

    interface Props {
        label: string;
        isWaiting?: boolean;
        disabled?: boolean;
        onclick?: (() => void) | null
    }

    const { label, isWaiting = false, disabled = false, onclick = null }: Props  = $props();
</script>

<button class="button" disabled={disabled||isWaiting} onclick={onclick}>{label}</button>

<style>
.button {
    text-align: center;
    padding: 0.6em 1em;
    font-size: 1rem;
    line-height: 1.1;
    background-color: blue;
    border: none;
    border-radius: var(--border-radius-global);
    outline: none;
    color: white;
    font-weight: bold;
    transition: all .2s ease-in;
    cursor: pointer;
    opacity: 1;
}

.button:focus,
.button:hover {
    outline: 2px solid rgba(0, 0, 255, 0.3);
}

.button:active {
    opacity: 0.9;
}
</style>
