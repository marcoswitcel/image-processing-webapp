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

	public connect(to: EditableFilterNode): void {
		// Por hora um filtro só pode apontar para outro uma única vez e o filtro alvo só pode ser apontado uma vez
		if (this.out.includes(to) || to.in.includes(this)) return;

		this.out.push(to);
		to.in.push(this);
	}
}
