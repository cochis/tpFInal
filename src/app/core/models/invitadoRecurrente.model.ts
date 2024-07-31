export class InvitadoRecurrente {
    constructor(
        public email: string,
        public grupo: string,
        public salon: string,
        public nombreGrupo: string,
        public whatsapp: string,
        public activated: boolean,
        public dateCreated: number,
        public usuarioCreated: string,
        public lastEdited: number,
        public uid: string
    ) { }
}