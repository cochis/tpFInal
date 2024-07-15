export class DefaultTemplate {
    constructor(
        public cPrincipal: string,
        public cSecond: string,
        public cWhite: string,
        public img1: string,
        public xImg1: number,
        public topTitle: number,
        public invitado: string,
        public cantidad: number,
        public tipoFiesta: string,
        public topDate: number,
        public nombreFiesta: string,
        public textInvitacionValida: string,
        public mensajeImg: string,
        public mensaje1: string,
        public donde1Check: boolean,
        public donde1Img: string,
        public donde1Title: string,
        public donde1Text: string,
        public donde1Date: number,
        public donde1Icon: string,
        public donde1AddressUbicacion: string,
        public donde1Address: string,
        public donde2Check: boolean,
        public donde2Img: string,
        public donde2Title: string,
        public donde2Text: string,
        public donde2Date: number,
        public donde2Icon: string,
        public donde2AddressUbicacion: string,
        public donde2Address: string,
        public donde3Check: boolean,
        public donde3Img: string,
        public donde3Title: string,
        public donde3Text: string,
        public donde3Date: number,
        public donde3Icon: string,
        public donde3AddressUbicacion: string,
        public donde3Address: string,
        public hospedajeCheck: boolean,
        public hospedajeImg: string,
        public hospedajeName: string,
        public hospedajeIcon: string,
        public hospedajeAddress: string,
        public hospedajeUbicacion: string,
        public hospedajeUrl: string,
        public hospedajePhone: string,
        public itinerarioCheck: boolean,
        public itinerarioName: string,
        public itinerario: [any],
        public notaCheck: boolean,
        public notas: [Nota],
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) {

       


    }
}

class Itinerario {
    constructor(
        public name: string,
        public hr: string
    ) { }
}
class Nota {
    constructor(
        public texto: string,

    ) { }
} 
