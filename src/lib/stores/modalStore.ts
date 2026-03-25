import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
import type { Component } from 'svelte';
import { writable } from 'svelte/store';

export interface ModalState {
    isOpen: boolean,
    component: Component | null;
    props?: Record<string, unknown>;
}

let lastPromise: ((value: void | PromiseLike<void>) => void) | null = null;

function resolveIfAnyPending(value: unknown = false) {
    lastPromise?.(value as void);
    lastPromise = null;
}

export const modalStore = writable<ModalState>({
    isOpen: false,
    component: null,
    props: {},
});

// @todo joão deixar assíncrono
// @todo joão fazer isso typesafe
export function open<T extends Record<string, unknown>>(component: Component<T>, props: T): Promise<void> {
    console.assert(lastPromise === null, 'Não deveria abrir modais em cima de outros modais');
    resolveIfAnyPending();

    return new Promise((resolve) => {
        lastPromise = resolve;
        modalStore.set({ component: component as Component, props, isOpen: true });
    })
}

function close() {

    // @todo joão, precisa desmontar o componente depois da animação de fade-out
    modalStore.set({ component: null, props: {}, isOpen: false });

    // @todo João, falta trocar evento e captura o valor
    resolveIfAnyPending();
}

export function confirm(title: string, description: string) {
    // @todo joão, passar props, title e description
    return open(ConfirmationModal, { title, description, });
}

export function alert() {
    // @todo joão, criar alert
    // return open(ConfirmationModal, {});
}

export const Modal = {
    open,
    confirm,
    alert,
    close,
}
