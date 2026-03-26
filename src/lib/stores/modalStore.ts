import AlertModal from '$lib/components/AlertModal.svelte';
import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
import LoadingModal from '$lib/components/LoadingModal.svelte';
import type { Component } from 'svelte';
import { writable } from 'svelte/store';

export interface ModalState {
    isOpen: boolean,
    component: Component | null;
    props?: Record<string, unknown>;
}

let lastPromise: ((value: unknown) => void) | null = null;

function resolveIfAnyPending(value: unknown = false) {
    lastPromise?.(value as void);
    lastPromise = null;
}

export const modalStore = writable<ModalState>({
    isOpen: false,
    component: null,
    props: {},
});


export function open<T extends Record<string, unknown>, P = void>(component: Component<T>, props: T): Promise<P> {
    console.assert(lastPromise === null, 'Não deveria abrir modais em cima de outros modais');
    resolveIfAnyPending();

    return new Promise((resolve) => {
        lastPromise = resolve as (value: unknown) => void;
        modalStore.set({ component: component as Component, props, isOpen: true });
    })
}

function close(value?: unknown) {

    // @todo joão, precisa desmontar o componente depois da animação de fade-out
    modalStore.set({ component: null, props: {}, isOpen: false });

    resolveIfAnyPending(value);
}

export function confirm(title: string, description: string): Promise<boolean> {
    return open(ConfirmationModal, { title, description, close: close });
}

export function alert(title: string, description: string): Promise<void> {
    return open(AlertModal, { title, description, close: close });
}

export function loading(): Promise<void> {
    return open(LoadingModal, {});
}

export const Modal = {
    open,
    confirm,
    alert,
    close,
    loading,
}
