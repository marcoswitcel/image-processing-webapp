


export class EditableFilterNode {
    id: string = crypto.randomUUID();

    in: Array<EditableFilterNode> = [];
    out: Array<EditableFilterNode> = [];

    x = $state(0);
    y = $state(0);

    
}
