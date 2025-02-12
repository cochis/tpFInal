
export class CalificacionOrden {
    constructor(

        public calificacion: boolean,
        public usuarioEvaluador: string,
        public proveedor: string,
        public ordenEvaluada: string,
        public dateCreated: number,
        public lastEdited: number,
        public isEvaluada?: string,
        public uid?: string
    ) { }
}

