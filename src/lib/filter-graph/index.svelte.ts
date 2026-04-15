


export class EditableFilterNode {
    /**
     * UUID
     */
    id: string = crypto.randomUUID();

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
		this.out.push(to);
		to.in.push(this);
	}
}
