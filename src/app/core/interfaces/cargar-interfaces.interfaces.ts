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
import { Push } from "../models/push.model"
import { Log } from "../models/log.model"
import { TipoCentro } from "../models/tipoCentro.model"
import { Paquete } from "../models/paquete.model"
import { Parametro } from "../models/parametro.model"
import { Ejemplo } from "../models/ejemplo.model"
import { TipoColor } from "../models/tipoColor.model"
import { TipoContacto } from "../models/tipoContacto.model"
import { Proveedor } from "../models/proveedor.model"
import { TipoItem } from "../models/tipoItem.model"
import { CategoriaItem } from "../models/categoriaItem.model"
import { Item } from "../models/item.model"
import { Moneda } from "../models/moneda.model"
import { TipoMedia } from "../models/tipoMedia.model"
import { ImgItem } from "../models/imgItem.model"
import { Cp } from "../models/cp.model"
import { Pais } from "../models/pais.model"
import { Cotizacion } from "../models/cotizacion.model"
import { EstatusCotizacion } from "../models/estatusCotizacion.model"
import { Calificacion } from "../models/calificacion.model"
import { TipoUbicacion } from "../models/tipoUbicacion.model"
import { Red } from "../models/red.model"
import { MailTemplate } from "../models/mailTemplate.model"



export interface CargarUsuario {
    usuario: Usuario
}

export interface CargarUsuarios {
    total: number
    usuarios: Usuario[]
}
export interface CargarTipoCentro {
    tipoCentro: TipoCentro
}

export interface CargarTipoCentros {
    total: number
    tipoCentros: TipoCentro[]
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
export interface CargarPaquete {
    paquete: Paquete
}

export interface CargarPaquetes {
    total: number
    paquetes: Paquete[]
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
export interface CargarMailTemplate {
    mailTemplate: MailTemplate
}
export interface CargarMailTemplates {
    total: number
    mailTemplates: MailTemplate[]
}
export interface CargarRed {
    red: Red
}
export interface CargarRedes {
    total: number
    redes: Red[]
}
export interface CargarTipoUbicacion {
    tipoUbicacion: TipoUbicacion
}
export interface CargarTipoUbicaciones {
    total: number
    tipoUbicaciones: TipoUbicacion[]
}
export interface CargarCalificacion {
    calificacion: Calificacion
}
export interface CargarCalificaciones {
    total: number
    calificaciones: Calificacion[]
}
/* CPS */
export interface CargarCp {
    cp: Cp
}
export interface CargarCps {
    total: number
    cps: Cp[]
}
/* Paises */
export interface CargarPais {
    pais: Pais
}
export interface CargarPaises {
    total: number
    paises: Pais[]
}
export interface CargarTipoMedia {
    tipoMedia: TipoMedia
}
export interface CargarTipoMedias {
    total: number
    tipoMedias: TipoMedia[]
}
export interface CargarMoneda {
    moneda: Moneda
}
export interface CargarMonedas {
    total: number
    monedas: Moneda[]
}
export interface CargarProveedor {
    proveedor: Proveedor
}
export interface CargarProveedors {
    total: number
    proveedors: Proveedor[]
}
export interface CargarEjemplo {
    ejemplo: Ejemplo
}
export interface CargarEjemplos {
    total: number
    ejemplos: Ejemplo[]
}
export interface CargarParametro {
    parametro: Parametro
}
export interface CargarParametros {
    total: number
    parametros: Parametro[]
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
export interface CargarPush {
    push: Push
}
export interface CargarPushs {
    total: number
    pushs: Push[]
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
export interface CargarTipoItem {
    tipoItem: TipoItem
}
export interface CargarTipoItems {
    total: number
    tipoItems: TipoItem[]
}
export interface CargarItem {
    item: Item
}
export interface CargarItems {
    total: number
    items: Item[]
}
export interface CargarImgItem {
    imgItem: ImgItem
}
export interface CargarImgItems {
    total: number
    imgItems: ImgItem[]
}
export interface CargarCategoriaItem {
    categoriaItem: CategoriaItem
}
export interface CargarCategoriaItems {
    total: number
    categoriaItems: CategoriaItem[]
}
export interface CargarTipoColor {
    tipoColor: TipoColor
}
export interface CargarTipoColors {
    total: number
    tipoColors: TipoColor[]
}
export interface CargarTipoContacto {
    tipoContacto: TipoContacto
}
export interface CargarTipoContactos {
    total: number
    tipoContactos: TipoContacto[]
}
export interface CargarEstatusCotizacion {
    estatusCotizacion: EstatusCotizacion
}
export interface CargarEstatusCotizaciones {
    total: number
    estatusCotizaciones: EstatusCotizacion[]
}
export interface CargarCotizacion {
    cotizacion: Cotizacion
}
export interface CargarCotizaciones {
    total: number
    cotizaciones: Cotizacion[]
}
export interface CargarModuloTemplate {
    moduloTemplate: ModuloTemplate
}
export interface CargarModuloTemplates {
    total: number
    moduloTemplates: ModuloTemplate[]
}
export interface PagingConfig {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}
export interface CargarLog {
    log: Log
}

export interface CargarLogs {
    total: number
    logs: Log[]
} 
