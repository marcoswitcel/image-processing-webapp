import AlertModal from '$lib/components/AlertModal.svelte';
import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
import LoadingModal from '$lib/components/LoadingModal.svelte';
import type { Component } from 'svelte';
import { writable } from 'svelte/store';

export interface ModalState {
	isOpen: boolean;
	component: Component | null;
	dismissable: boolean;
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
	dismissable: false,
	props: {}
});

export function open<T extends Record<string, unknown>, P = void>(
	component: Component<T>,
	props: T,
	dismissable = false
): Promise<P> {
	console.assert(lastPromise === null, 'Não deveria abrir modais em cima de outros modais');
	resolveIfAnyPending();

	return new Promise((resolve) => {
		lastPromise = resolve as (value: unknown) => void;
		modalStore.set({
			component: component as Component,
			props,
			isOpen: true,
			dismissable: dismissable
		});
	});
}

function close(value?: unknown) {
	// @todo joão, precisa desmontar o componente depois da animação de fade-out
	modalStore.set({ component: null, props: {}, isOpen: false, dismissable: false });

	resolveIfAnyPending(value);
}

/**
 * Exibe um modal de confirmação; perguntas que precisam de sim ou não
 * @param title título do modal de confirmação
 * @param description descrição e ou detalhes extras
 * @returns promise que resolve quando o usuário interage com o botão de confirmação ou declínio
 */
export function confirm(title: string, description: string): Promise<boolean> {
	return open(ConfirmationModal, { title, description, close }, false);
}

export function alert(title: string, description: string): Promise<void> {
	return open(AlertModal, { title, description, close });
}

/**
 * Modal utilitário usado para indicar que alguma "coisa" está acontecendo,
 * por exemplo: aguardando a câmera inicializar
 * @param title descrição que aparece modal
 * @returns promise que resolve quando molda é fechado
 */
export function loading(title?: string): Promise<void> {
	return open(LoadingModal, { title });
}

export const Modal = {
	open,
	confirm,
	alert,
	close,
	loading
};
