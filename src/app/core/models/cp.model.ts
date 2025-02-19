
export class Cp {
    constructor(
        public d_codigo: string,
        public d_asenta: string,
        public d_tipo_asenta: string,
        public D_mnpio: string,
        public d_estado: string,
        public d_ciudad: string,
        public d_CP: string,
        public c_estado: string,
        public c_oficina: string,
        public c_CP: string,
        public c_tipo_asenta: string,
        public c_mnpio: string,
        public id_asenta_cpcons: string,
        public d_zona: string,
        public c_cve_ciudad: string,
        public pais_clv: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}

