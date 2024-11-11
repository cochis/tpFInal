export class Boleto {
    constructor(
        public fiesta: string,
        public email: string,
        public cantidadInvitados: number,
        public mesa: string,
        public grupo: string,
        public salon: string,
        public nombreGrupo: string,
        public whatsapp: string,
        public confirmado: boolean,
        public invitacionEnviada: boolean,
        public activated: boolean,
        public ocupados: number,
        public vista:boolean,
        public pushNotification: [object],
        public requeridos: number,
        public dateCreated: number,
        public usuarioCreated: string,
        public fechaConfirmacion: number,
        public lastEdited: number,
        public uid: string
    ) { }
}