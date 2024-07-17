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
import { NgxPaginationModule } from 'ngx-pagination'






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

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ZXingScannerModule,
    SharedModule,
    QRCodeModule,
    NgxPaginationModule

  ]
})
export class CoreModule { }
