<script lang="ts">

    interface Props {
        label: string;
        isWaiting: boolean;
        disabled: boolean;
    }

    const { label, isWaiting, disabled }: Props  = $props();
</script>

<button class="button" disabled={disabled||isWaiting}>{label}</button>

<style>
.button {
    text-align: center;
    padding: 1em;
}
</style>
