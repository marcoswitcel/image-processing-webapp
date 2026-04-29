import type { FilterProcessor } from '$lib/filter';

export const filterSelected: { current: FilterProcessor | null } = $state({
	current: null
});

function selectFilter(filter: FilterProcessor) {
	filterSelected.current = filter;
}

// @ts-expect-error exportando campo
window['selectFilter'] = selectFilter;
