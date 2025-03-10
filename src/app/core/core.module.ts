import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CoreComponent } from './core.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SharedModule } from '../shared/shared.module';
import { VistaUsuariosComponent } from './pages/admin/usuarios/vista-usuarios/vista-usuarios.component';
import { EditarUsuarioComponent } from './pages/admin/usuarios/editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './pages/admin/usuarios/crear-usuario/crear-usuario.component';
import { CrearRolComponent } from './pages/admin/roles/crear-rol/crear-rol.component';
import { EditarRolComponent } from './pages/admin/roles/editar-rol/editar-rol.component';
import { VistaRolesComponent } from './pages/admin/roles/vista-roles/vista-roles.component';
import { VistaGruposComponent } from './pages/admin/grupos/vista-grupos/vista-grupos.component';
import { CrearGrupoComponent } from './pages/admin/grupos/crear-grupo/crear-grupo.component';
import { EditarGrupoComponent } from './pages/admin/grupos/editar-grupo/editar-grupo.component';
import { EditarEventoComponent } from './pages/admin/eventos/editar-evento/editar-evento.component';
import { CrearEventoComponent } from './pages/admin/eventos/crear-evento/crear-evento.component';
import { VistaEventosComponent } from './pages/admin/eventos/vista-eventos/vista-eventos.component';
import { VistaSalonesComponent } from './pages/admin/salones/vista-salones/vista-salones.component';
import { EditarSalonComponent } from './pages/admin/salones/editar-salon/editar-salon.component';
import { CrearSalonComponent } from './pages/admin/salones/crear-salon/crear-salon.component';
import { CrearFiestaComponent } from './pages/admin/fiestas/crear-fiesta/crear-fiesta.component';
import { EditarFiestaComponent } from './pages/admin/fiestas/editar-fiesta/editar-fiesta.component';
import { VistaFiestasComponent } from './pages/admin/fiestas/vista-fiestas/vista-fiestas.component';
import { CrearBoletoComponent } from './pages/admin/boletos/crear-boleto/crear-boleto.component';
import { EditarBoletoComponent } from './pages/admin/boletos/editar-boleto/editar-boleto.component';
import { VistaBoletosComponent } from './pages/admin/boletos/vista-boletos/vista-boletos.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RegistarSalonComponent } from './pages/admin/salones/registar-salon/registar-salon.component';
import { MisFiestasComponent } from './pages/admin/fiestas/mis-fiestas/mis-fiestas.component';
import { CheckInComponent } from './pages/admin/boletos/check-in/check-in.component';
import { InvitacionesComponent } from './invitaciones/invitaciones.component';
import { Boda1Component } from './invitaciones/bodas/boda1/boda1.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { Xv1Component } from './invitaciones/xv/xv1/xv1.component';
import { VistaInvitacionesComponent } from './pages/admin/invitaciones/vista-invitaciones/vista-invitaciones.component';
import { CrearInvitacionComponent } from './pages/admin/invitaciones/crear-invitacion/crear-invitacion.component';
import { EditarInvitacionComponent } from './pages/admin/invitaciones/editar-invitacion/editar-invitacion.component';
import { Xv2Component } from './invitaciones/xv/xv2/xv2.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Pc1Component } from './invitaciones/primeraCominion/pc1/pc1.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';

import { CrearTipoCantidadComponent } from './pages/admin/tipo-cantidad/crear-tipo-cantidad/crear-tipo-cantidad.component';
import { EditarTipoCantidadComponent } from './pages/admin/tipo-cantidad/editar-tipo-cantidad/editar-tipo-cantidad.component';
import { VistaTipoCantidadComponent } from './pages/admin/tipo-cantidad/vista-tipo-cantidad/vista-tipo-cantidad.component';
import { ComprarPaqueteComponent } from './pages/admin/comprar-paquete/comprar-paquete.component';
import { VistaStatusCompraComponent } from './pages/admin/status-compra/vista-status-compra/vista-status-compra.component';
import { CrearStatusCompraComponent } from './pages/admin/status-compra/crear-status-compra/crear-status-compra.component';
import { EditarStatusCompraComponent } from './pages/admin/status-compra/editar-status-compra/editar-status-compra.component';
import { EditarCompraComponent } from './pages/admin/compra/editar-compra/editar-compra.component';
import { CrearCompraComponent } from './pages/admin/compra/crear-compra/crear-compra.component';
import { VistaComprasComponent } from './pages/admin/compra/vista-compras/vista-compras.component';
import { CrearTipoModuloComponent } from './pages/admin/tipo-modulos/crear-tipo-modulo/crear-tipo-modulo.component';
import { EditarTipoModuloComponent } from './pages/admin/tipo-modulos/editar-tipo-modulo/editar-tipo-modulo.component';
import { VistaTipoModulosComponent } from './pages/admin/tipo-modulos/vista-tipo-modulos/vista-tipo-modulos.component';
import { DefaultComponent } from './pages/admin/templates/default/default.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfoFiestaComponent } from './pages/admin/fiestas/info-fiesta/info-fiesta.component';
import { ByImagesComponent } from './pages/admin/templates/by-images/by-images.component';
import { BorradoComponent } from './pages/admin/borrado/borrado.component';
import { CrearTipoCentroComponent } from './pages/admin/tipo-centros/crear-tipo-centro/crear-tipo-centro.component';
import { EditarTipoCentroComponent } from './pages/admin/tipo-centros/editar-tipo-centro/editar-tipo-centro.component';
import { VistaTipoCentrosComponent } from './pages/admin/tipo-centros/vista-tipo-centros/vista-tipo-centros.component';
import { VistaInvitadosRecurrentesComponent } from './pages/admin/invitados-recurrentes/vista-invitados-recurrentes/vista-invitados-recurrentes.component';
import { EditarInvitadosRecurrentesComponent } from './pages/admin/invitados-recurrentes/editar-invitados-recurrentes/editar-invitados-recurrentes.component';
import { CrearInvitadosRecurrentesComponent } from './pages/admin/invitados-recurrentes/crear-invitados-recurrentes/crear-invitados-recurrentes.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { CrearPaqueteComponent } from './pages/admin/paquete/crear-paquete/crear-paquete.component';
import { EditarPaqueteComponent } from './pages/admin/paquete/editar-paquete/editar-paquete.component';
import { VistaPaquetesComponent } from './pages/admin/paquete/vista-paquetes/vista-paquetes.component';
import { TerminosYCondicionesComponent } from './pages/terminos-y-condiciones/terminos-y-condiciones.component';
import { PoliticaDePrivacidadComponent } from './pages/politica-de-privacidad/politica-de-privacidad.component';
import { VistaParametrosComponent } from './pages/admin/parametros/vista-parametros/vista-parametros.component';
import { CrearParametroComponent } from './pages/admin/parametros/crear-parametro/crear-parametro.component';
import { EditarParametroComponent } from './pages/admin/parametros/editar-parametro/editar-parametro.component';
import { ByFileComponent } from './pages/admin/templates/by-file/by-file.component';
import { EjemplosComponent } from './pages/ejemplos/ejemplos.component';
import { SingleFiestaComponent } from './pages/admin/fiestas/single-fiesta/single-fiesta.component';
import { VistaEjemplosComponent } from './pages/admin/ejemplos/vista-ejemplos/vista-ejemplos.component';
import { CrearEjemploComponent } from './pages/admin/ejemplos/crear-ejemplo/crear-ejemplo.component';
import { EditarEjemploComponent } from './pages/admin/ejemplos/editar-ejemplo/editar-ejemplo.component';
import { MarketComponent } from './pages/market/market.component';
import { SingleProductComponent } from './pages/market/views/single-product/single-product.component';
import { SingleSupplierComponent } from './pages/market/views/single-supplier/single-supplier.component';
import { SingleCategoryComponent } from './pages/market/views/single-category/single-category.component';
import { CarritoComponent } from './pages/admin/market/carrito/carrito.component';
import { MarketItemsComponent } from './pages/market/market-items/market-items.component';
import { ItemComponent } from './pages/market/item/item.component';
import { VistaTipoColoresComponent } from './pages/admin/tipo-colores/vista-tipo-colores/vista-tipo-colores.component';
import { CrearTipoColorComponent } from './pages/admin/tipo-colores/crear-tipo-color/crear-tipo-color.component';
import { EditarTipoColorComponent } from './pages/admin/tipo-colores/editar-tipo-color/editar-tipo-color.component';
import { VistaTipoContactosComponent } from './pages/admin/tipo-contactos/vista-tipo-contactos/vista-tipo-contactos.component';
import { EditarTipoContactoComponent } from './pages/admin/tipo-contactos/editar-tipo-contacto/editar-tipo-contacto.component';
import { CrearTipoContactoComponent } from './pages/admin/tipo-contactos/crear-tipo-contacto/crear-tipo-contacto.component';
import { VistaProvedorsComponent } from './pages/admin/market/admin/proveedors/vista-provedors/vista-provedors.component';
import { CrearProvedorComponent } from './pages/admin/market/admin/proveedors/crear-provedor/crear-provedor.component';
import { EditarProvedorComponent } from './pages/admin/market/admin/proveedors/editar-provedor/editar-provedor.component';
import { EditarItemComponent } from './pages/admin/market/admin/items/editar-item/editar-item.component';
import { CrearItemComponent } from './pages/admin/market/admin/items/crear-item/crear-item.component';
import { VistaItemsComponent } from './pages/admin/market/admin/items/vista-items/vista-items.component';
import { VistaTipoItemsComponent } from './pages/admin/tipo-items/vista-tipo-items/vista-tipo-items.component';
import { CrearTipoItemComponent } from './pages/admin/tipo-items/crear-tipo-item/crear-tipo-item.component';
import { EditarTipoItemComponent } from './pages/admin/tipo-items/editar-tipo-item/editar-tipo-item.component';
import { VistaCategoriaItemsComponent } from './pages/admin/categoria-items/vista-categoria-items/vista-categoria-items.component';
import { EditarCategoriaItemComponent } from './pages/admin/categoria-items/editar-categoria-item/editar-categoria-item.component';
import { CrearCategoriaItemComponent } from './pages/admin/categoria-items/crear-categoria-item/crear-categoria-item.component';
import { VistaMonedasComponent } from './pages/admin/monedas/vista-monedas/vista-monedas.component';
import { CrearMonedaComponent } from './pages/admin/monedas/crear-moneda/crear-moneda.component';
import { EditarMonedaComponent } from './pages/admin/monedas/editar-moneda/editar-moneda.component';
import { CrearTipoMediaComponent } from './pages/admin/tipo-medias/crear-tipo-media/crear-tipo-media.component';
import { EditarTipoMediaComponent } from './pages/admin/tipo-medias/editar-tipo-media/editar-tipo-media.component';
import { VistaTipoMediasComponent } from './pages/admin/tipo-medias/vista-tipo-medias/vista-tipo-medias.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { PrincipalComponent } from './pages/admin/templates/default/components/principal/principal.component';
import { InvitacionCardComponent } from './pages/admin/templates/default/components/invitacion-card/invitacion-card.component';
import { MensajeCardComponent } from './pages/admin/templates/default/components/mensaje-card/mensaje-card.component';
import { ListasCardComponent } from './pages/admin/templates/default/components/listas-card/listas-card.component';
import { DondeCardComponent } from './pages/admin/templates/default/components/donde-card/donde-card.component';
import { QrCardComponent } from './pages/admin/templates/default/components/qr-card/qr-card.component';
import { VistaCpsComponent } from './pages/admin/cps/vista-cps/vista-cps.component';
import { EditarCpComponent } from './pages/admin/cps/editar-cp/editar-cp.component';
import { CrearCpComponent } from './pages/admin/cps/crear-cp/crear-cp.component';
import { CrearPaisComponent } from './pages/admin/paises/crear-pais/crear-pais.component';
import { EditarPaisComponent } from './pages/admin/paises/editar-pais/editar-pais.component';
import { VistaPaisesComponent } from './pages/admin/paises/vista-paises/vista-paises.component';
import { VistaEstatusCotizacionesComponent } from './pages/admin/estatus-cotizaciones/vista-estatus-cotizaciones/vista-estatus-cotizaciones.component';
import { EditarEstatusCotizacionComponent } from './pages/admin/estatus-cotizaciones/editar-estatus-cotizacion/editar-estatus-cotizacion.component';
import { CrearEstatusCotizacionComponent } from './pages/admin/estatus-cotizaciones/crear-estatus-cotizacion/crear-estatus-cotizacion.component';
import { VistaCotizacionesComponent } from './pages/admin/cotizaciones/vista-cotizaciones/vista-cotizaciones.component';
import { CrearCotizacionComponent } from './pages/admin/cotizaciones/crear-cotizacion/crear-cotizacion.component';
import { EditarCotizacionComponent } from './pages/admin/cotizaciones/editar-cotizacion/editar-cotizacion.component';
import { MisCotizacionesComponent } from './pages/admin/cotizaciones/mis-cotizaciones/mis-cotizaciones.component';
import { MiCotizacionComponent } from './pages/admin/cotizaciones/mi-cotizacion/mi-cotizacion.component';
import { EditarDatosComponent } from './pages/admin/market/admin/proveedors/editar-datos/editar-datos.component';
import { CalificacionComponent } from './pages/admin/market/admin/items/calificacion/calificacion.component';
import { ProveedoresComponent } from './pages/market/views/proveedores/proveedores.component';
import { ProveedoresItemsComponent } from './pages/market/views/proveedores/proveedores-items/proveedores-items.component';
import { PrintQrComponent } from './pages/admin/market/admin/proveedors/print-qr/print-qr.component';
import { VistaTipoUbicacionesComponent } from './pages/admin/tipo-ubicaciones/vista-tipo-ubicaciones/vista-tipo-ubicaciones.component';
import { CrearTipoUbicacionComponent } from './pages/admin/tipo-ubicaciones/crear-tipo-ubicacion/crear-tipo-ubicacion.component';
import { EditarTipoUbicacionComponent } from './pages/admin/tipo-ubicaciones/editar-tipo-ubicacion/editar-tipo-ubicacion.component';
import { CrearPromoComponent } from './pages/admin/promos/crear-promo/crear-promo.component';
import { NgxEditorModule } from 'ngx-editor';
import { CrearRedComponent } from './pages/admin/redes/crear-red/crear-red.component';
import { EditarRedComponent } from './pages/admin/redes/editar-red/editar-red.component';
import { VistaRedesComponent } from './pages/admin/redes/vista-redes/vista-redes.component';
import { VistaEmailTemplatesComponent } from './pages/admin/email-templates/vista-email-templates/vista-email-templates.component';
import { CrearEmailTemplateComponent } from './pages/admin/email-templates/crear-email-template/crear-email-template.component';
import { EditarEmailTemplateComponent } from './pages/admin/email-templates/editar-email-template/editar-email-template.component';







@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent,
    CoreComponent,
    VistaUsuariosComponent,
    EditarUsuarioComponent,
    CrearUsuarioComponent,
    CrearRolComponent,
    EditarRolComponent,
    VistaRolesComponent,
    VistaGruposComponent,
    CrearGrupoComponent,
    EditarGrupoComponent,
    EditarEventoComponent,
    CrearEventoComponent,
    VistaEventosComponent,
    VistaSalonesComponent,
    EditarSalonComponent,
    CrearSalonComponent,
    CrearFiestaComponent,
    EditarFiestaComponent,
    VistaFiestasComponent,
    CrearBoletoComponent,
    EditarBoletoComponent,
    VistaBoletosComponent,
    RegistarSalonComponent,
    MisFiestasComponent,
    CheckInComponent,
    InvitacionesComponent,
    Boda1Component,
    PricingComponent,
    Xv1Component,
    VistaInvitacionesComponent,
    CrearInvitacionComponent,
    EditarInvitacionComponent,
    Xv2Component,
    DefaultComponent,
    Pc1Component,
    GaleriaComponent,
    CrearTipoCantidadComponent,
    CrearTipoCantidadComponent,
    EditarTipoCantidadComponent,
    VistaTipoCantidadComponent,
    ComprarPaqueteComponent,
    VistaStatusCompraComponent,
    CrearStatusCompraComponent,
    EditarStatusCompraComponent,
    EditarCompraComponent,
    CrearCompraComponent,
    VistaComprasComponent,
    CrearTipoModuloComponent,
    EditarTipoModuloComponent,
    VistaTipoModulosComponent,
    InfoFiestaComponent,
    ByImagesComponent,
    BorradoComponent,
    CrearTipoCentroComponent,
    EditarTipoCentroComponent,
    VistaTipoCentrosComponent,
    CrearTipoCentroComponent,
    EditarTipoCentroComponent,
    VistaInvitadosRecurrentesComponent,
    EditarInvitadosRecurrentesComponent,
    CrearInvitadosRecurrentesComponent,
    FaqsComponent,
    CrearPaqueteComponent,
    EditarPaqueteComponent,
    VistaPaquetesComponent,
    TerminosYCondicionesComponent,
    PoliticaDePrivacidadComponent,
    VistaParametrosComponent,
    CrearParametroComponent,
    EditarParametroComponent,
    ByFileComponent,
    EjemplosComponent,
    SingleFiestaComponent,
    VistaEjemplosComponent,
    CrearEjemploComponent,
    EditarEjemploComponent,
    MarketComponent,
    SingleProductComponent,
    SingleSupplierComponent,
    SingleCategoryComponent,
    CarritoComponent,
    MarketItemsComponent,
    ItemComponent,
    VistaTipoColoresComponent,
    CrearTipoColorComponent,
    EditarTipoColorComponent,
    VistaTipoContactosComponent,
    EditarTipoContactoComponent,
    CrearTipoContactoComponent,
    VistaProvedorsComponent,
    CrearProvedorComponent,
    EditarProvedorComponent,
    EditarItemComponent,
    CrearItemComponent,
    VistaItemsComponent,
    VistaTipoItemsComponent,
    CrearTipoItemComponent,
    EditarTipoItemComponent,
    VistaCategoriaItemsComponent,
    EditarCategoriaItemComponent,
    CrearCategoriaItemComponent,
    VistaMonedasComponent,
    CrearMonedaComponent,
    EditarMonedaComponent,
    CrearTipoMediaComponent,
    EditarTipoMediaComponent,
    VistaTipoMediasComponent,
    PrincipalComponent,
    InvitacionCardComponent,
    MensajeCardComponent,
    ListasCardComponent,
    DondeCardComponent,
    QrCardComponent,
    VistaCpsComponent,
    EditarCpComponent,
    CrearCpComponent,
    CrearPaisComponent,
    EditarPaisComponent,
    VistaPaisesComponent,
    VistaEstatusCotizacionesComponent,
    EditarEstatusCotizacionComponent,
    CrearEstatusCotizacionComponent,
    VistaCotizacionesComponent,
    CrearCotizacionComponent,
    EditarCotizacionComponent,
    MisCotizacionesComponent,
    MiCotizacionComponent,
    EditarDatosComponent,
    CalificacionComponent,
    ProveedoresComponent,
    ProveedoresItemsComponent,
    PrintQrComponent,
    VistaTipoUbicacionesComponent,
    CrearTipoUbicacionComponent,
    EditarTipoUbicacionComponent,
    CrearPromoComponent,
    CrearRedComponent,
    EditarRedComponent,
    VistaRedesComponent,
    VistaEmailTemplatesComponent,
    CrearEmailTemplateComponent,
    EditarEmailTemplateComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ZXingScannerModule,
    SharedModule,
    QRCodeModule,
    NgxPaginationModule,
    NgxCurrencyDirective,
    NgxEditorModule,
    FullCalendarModule
  ],
  exports: [MarketItemsComponent]
})
export class CoreModule { }
