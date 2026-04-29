/**
 *
 */
export type NodeTypes = 'source' | 'output' | 'filter';

export class EditableFilterNode {
	/**
	 * UUID
	 */
	id: string = crypto.randomUUID();

	/**
	 * tipo do node
	 */
	type: NodeTypes = 'source';

	/**
	 * Nome do filtro
	 */
	filterName: string;

	/**
	 * Indica se é multi-input
	 */
	multiInput: boolean = false;

	/**
	 * Indica se o output dessa camada precisa de blending, ou sai pronto para envio para próxima etapa
	 */
	needsBlending: boolean = false;

	/**
	 * Filtros que alimentam essa etapa
	 */
	in: Array<EditableFilterNode> = $state([]);

	/**
	 * Filtros que são alimentam por essa etapa
	 */
	out: Array<EditableFilterNode> = $state([]);

	/**
	 * Posição visual do filtro: x
	 */
	x = $state(0);

	/**
	 * Posição visual do filtro: y
	 */
	y = $state(0);

	constructor(filterName: string) {
		this.filterName = filterName;
	}

	public connect(to: EditableFilterNode): void {
		// Por hora um filtro só pode apontar para outro uma única vez e o filtro alvo só pode ser apontado uma vez
		if (this.out.includes(to) || to.in.includes(this)) return;

		this.out.push(to);
		to.in.push(this);
	}
}
