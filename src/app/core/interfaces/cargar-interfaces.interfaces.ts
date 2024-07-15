import { Boleto } from "../models/boleto.model"
import { Fiesta } from "../models/fiesta.model"
import { Role } from "../models/role.model"

import { Evento } from "../models/evento.model"

import { Grupo } from "../models/grupo.model"
import { Usuario } from "../models/usuario.model"
import { TokenPush } from "../models/tokenPush.model"
import { Invitacion } from "../models/invitacion.model"
import { Contacto } from "../models/contacto.model"
import { Galeria } from "../models/galeria.model"
import { Salon } from "../models/salon.model"
import { TipoCantidad } from "../models/tipoCantidad.model"
import { StatusCompra } from "../models/statusCompra.model"
import { Compra } from "../models/compra.model"
import { TipoModulo } from "../models/tipoModulo.model"
import { ModuloTemplate } from "../models/moduloTemplate.model"
import { Template } from "../models/template.model"



export interface CargarUsuario {
    usuario: Usuario
}

export interface CargarUsuarios {
    total: number
    usuarios: Usuario[]
}

export interface CargarStatusCompra {
    statusCompra: StatusCompra
}

export interface CargarStatusCompras {
    total: number
    statusCompras: StatusCompra[]
}
export interface CargarCompra {
    compra: Compra
}

export interface CargarCompras {
    total: number
    compras: Compra[]
}
export interface CargarRole {
    role: Role
}

export interface CargarRoles {
    total: number
    roles: Role[]
}
export interface CargarGaleria {
    galeria: Galeria
}

export interface CargarGalerias {
    total: number
    galerias: Galeria[]
}
export interface CargarTipoCantidad {
    tipoCantidad: TipoCantidad
}

export interface CargarTipoCantidades {
    total: number
    tipoCantidades: TipoCantidad[]
}
export interface CargarGrupo {
    grupo: Grupo
}



export interface CargarGrupos {
    total: number
    grupos: Grupo[]
}

export interface CargarEvento {
    evento: Evento
}
export interface CargarEventos {
    total: number
    eventos: Evento[]
}

export interface CargarFiesta {
    fiesta: Fiesta
}
export interface CargarFiestas {
    total: number
    fiestas: Fiesta[]
}
export interface CargarBoleto {
    boleto: Boleto
}
export interface CargarBoletos {
    total: number
    boletos: Boleto[]
}
export interface CargarSalon {
    salon: Salon
}
export interface CargarSalons {
    total: number
    salons: Salon[]
}
export interface CargarContacto {
    contacto: Contacto
}
export interface CargarContactos {
    total: number
    contactos: Contacto[]
}
export interface CargarInvitacion {
    invitacion: Invitacion
}
export interface CargarInvitacions {
    total: number
    invitacions: Invitacion[]
}
export interface CargarTokenPush {
    tokenPush: TokenPush
}
export interface CargarTokenPushs {
    total: number
    tokenPushs: TokenPush[]
}
export interface CargarTemplate {
    template: Template
}
export interface CargarTemplates {
    total: number
    templates: Template[]
}
export interface CargarTipoModulo {
    tipoModulo: TipoModulo
}
export interface CargarTipoModulos {
    total: number
    tipoModulos: TipoModulo[]
}
export interface CargarModuloTemplate {
    moduloTemplate: ModuloTemplate
}
export interface CargarModuloTemplates {
    total: number
    moduloTemplates: ModuloTemplate[]
}
