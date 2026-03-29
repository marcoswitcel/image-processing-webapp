import type { FilterProcessor } from "$lib/filter";

export const filterSelected: { current: FilterProcessor | null } = $state({
    current: null
});
