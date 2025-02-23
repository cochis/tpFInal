export class Item {
    constructor(
        public nombre: string,
        public descripcion: string,
        public proveedor: string,
        public tipoItem: string,
        public categoriaItem: string,
        public isSelectedBy: string,
        public isBySize: boolean,
        public isByService: boolean,
        public isByColor: boolean,
        public isByCantidad: boolean,
        public sizes: [object],
        public colores: [object],
        public photos: [object],
        public servicios: [object],
        public cantidades: [object],
        public idealTo: [object],
        public calificacion: [number],
        public timesCalificado: [number],
        public promedioCalificacion: [number],
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}