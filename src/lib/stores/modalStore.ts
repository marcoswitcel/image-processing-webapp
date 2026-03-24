import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
import type { Component } from 'svelte';
import { writable } from 'svelte/store';

export interface ModalState {
    isOpen: boolean,
    component: Component | null;
    props?: Record<string, unknown>;
}

export const modalStore = writable<ModalState>({
    isOpen: false,
    component: null,
    props: {},
});

// @todo joão deixar assíncrono
// @todo joão fazer isso typesafe
export function openModal(component: Component, props: Record<string, unknown> = {}) {
    modalStore.set({ component, props, isOpen: true });
}

export function closeModal() {
    // @todo joão, precisa desmontar o componente depois da animação de fade-out
    modalStore.set({ component: null, props: {}, isOpen: false });
}

export function openConfirm() {
    // @todo joão, passar props, title e description
    openModal(ConfirmationModal, {});
}
