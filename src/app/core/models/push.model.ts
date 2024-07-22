export class Push {
    constructor(
        public endpoint: string,
        public expirationTime: string,
        public keys: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid: string
    ) { }
}