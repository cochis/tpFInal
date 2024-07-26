export class Log {
    constructor(
        public url:string,
        public method:string,
        public queryParams:string,
        public request:object,
        public response:object,
        public statusCode:number,
        public usuarioCreated: string,
        public dateCreated: number,
        public uid?: string
        ) { }
    }

    