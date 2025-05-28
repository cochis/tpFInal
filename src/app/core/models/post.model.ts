export class Post {
    constructor(
        public titulo: string,
        public categoria: string,
        public contenido: string,
        public autor: string,
        public img: string,
        public respuestas: any[],
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}