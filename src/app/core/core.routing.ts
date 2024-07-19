import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { VistaUsuariosComponent } from './pages/admin/usuarios/vista-usuarios/vista-usuarios.component';
import { CrearUsuarioComponent } from './pages/admin/usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './pages/admin/usuarios/editar-usuario/editar-usuario.component';
import { EditarRolComponent } from './pages/admin/roles/editar-rol/editar-rol.component';
import { VistaRolesComponent } from './pages/admin/roles/vista-roles/vista-roles.component';
import { CrearRolComponent } from './pages/admin/roles/crear-rol/crear-rol.component';
import { EditarGrupoComponent } from './pages/admin/grupos/editar-grupo/editar-grupo.component';
import { CrearGrupoComponent } from './pages/admin/grupos/crear-grupo/crear-grupo.component';
import { VistaGruposComponent } from './pages/admin/grupos/vista-grupos/vista-grupos.component';
import { EditarEventoComponent } from './pages/admin/eventos/editar-evento/editar-evento.component';
import { CrearEventoComponent } from './pages/admin/eventos/crear-evento/crear-evento.component';
import { VistaEventosComponent } from './pages/admin/eventos/vista-eventos/vista-eventos.component';
import { EditarSalonComponent } from './pages/admin/salones/editar-salon/editar-salon.component';
import { CrearSalonComponent } from './pages/admin/salones/crear-salon/crear-salon.component';
import { VistaSalonesComponent } from './pages/admin/salones/vista-salones/vista-salones.component';
import { EditarFiestaComponent } from './pages/admin/fiestas/editar-fiesta/editar-fiesta.component';
import { CrearFiestaComponent } from './pages/admin/fiestas/crear-fiesta/crear-fiesta.component';
import { VistaFiestasComponent } from './pages/admin/fiestas/vista-fiestas/vista-fiestas.component';
import { EditarBoletoComponent } from './pages/admin/boletos/editar-boleto/editar-boleto.component';
import { CrearBoletoComponent } from './pages/admin/boletos/crear-boleto/crear-boleto.component';
import { VistaBoletosComponent } from './pages/admin/boletos/vista-boletos/vista-boletos.component';
import { RegistarSalonComponent } from './pages/admin/salones/registar-salon/registar-salon.component';
import { MisFiestasComponent } from './pages/admin/fiestas/mis-fiestas/mis-fiestas.component';
import { CheckInComponent } from './pages/admin/boletos/check-in/check-in.component';
import { authGuard } from '../guard/auth.guard';
import { InvitacionesComponent } from './invitaciones/invitaciones.component';
import { Boda1Component } from './invitaciones/bodas/boda1/boda1.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { Xv1Component } from './invitaciones/xv/xv1/xv1.component';
import { EditarInvitacionComponent } from './pages/admin/invitaciones/editar-invitacion/editar-invitacion.component';
import { CrearInvitacionComponent } from './pages/admin/invitaciones/crear-invitacion/crear-invitacion.component';
import { VistaInvitacionesComponent } from './pages/admin/invitaciones/vista-invitaciones/vista-invitaciones.component';
import { Xv2Component } from './invitaciones/xv/xv2/xv2.component';

import { Pc1Component } from './invitaciones/primeraCominion/pc1/pc1.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { EditarTipoCantidadComponent } from './pages/admin/tipo-cantidad/editar-tipo-cantidad/editar-tipo-cantidad.component';
import { CrearTipoCantidadComponent } from './pages/admin/tipo-cantidad/crear-tipo-cantidad/crear-tipo-cantidad.component';
import { VistaTipoCantidadComponent } from './pages/admin/tipo-cantidad/vista-tipo-cantidad/vista-tipo-cantidad.component';
import { ComprarPaqueteComponent } from './pages/admin/comprar-paquete/comprar-paquete.component';
import { VistaStatusCompraComponent } from './pages/admin/status-compra/vista-status-compra/vista-status-compra.component';
import { CrearStatusCompraComponent } from './pages/admin/status-compra/crear-status-compra/crear-status-compra.component';
import { EditarStatusCompraComponent } from './pages/admin/status-compra/editar-status-compra/editar-status-compra.component';
import { VistaComprasComponent } from './pages/admin/compra/vista-compras/vista-compras.component';
import { EditarCompraComponent } from './pages/admin/compra/editar-compra/editar-compra.component';
import { CrearCompraComponent } from './pages/admin/compra/crear-compra/crear-compra.component';
import { EditarTipoModuloComponent } from './pages/admin/tipo-modulos/editar-tipo-modulo/editar-tipo-modulo.component';
import { CrearTipoModuloComponent } from './pages/admin/tipo-modulos/crear-tipo-modulo/crear-tipo-modulo.component';
import { VistaTipoModulosComponent } from './pages/admin/tipo-modulos/vista-tipo-modulos/vista-tipo-modulos.component';
import { DefaultComponent } from './pages/admin/templates/default/default.component';
import { InfoFiestaComponent } from './pages/admin/fiestas/info-fiesta/info-fiesta.component';


const routes: Routes = [
  {
    path: 'core',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { titulo: 'Home' }

      },
      {
        path: 'about',
        component: AboutComponent,
        data: { titulo: 'Quienes somos' }

      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { titulo: 'Contacto' }

      },
      {
        path: 'pricing',
        component: PricingComponent,
        data: { titulo: 'Pricing' }

      },
      {
        path: 'mis-fiestas',
        component: MisFiestasComponent,
        data: { titulo: 'Mis fiestas' },
        canActivate: [authGuard]
      },

      {
        path: 'usuarios/vista-usuarios',
        component: VistaUsuariosComponent,
        data: { titulo: 'Vista usuarios' },
        canActivate: [authGuard]

      },
      {
        path: 'usuarios/crear-usuario',
        component: CrearUsuarioComponent,
        data: { titulo: 'Crear usuario' },
        canActivate: [authGuard]

      },
      {
        path: 'usuarios/editar-usuario/:edit/:id',
        component: EditarUsuarioComponent,
        data: { titulo: 'Editar usuario' },
        canActivate: [authGuard]

      },
      {
        path: 'status-compra/vista-status-compra',
        component: VistaStatusCompraComponent,
        data: { titulo: 'Vista status de compra' },
        canActivate: [authGuard]

      },
      {
        path: 'status-compra/crear-status-compra',
        component: CrearStatusCompraComponent,
        data: { titulo: 'Crear status de compra' },
        canActivate: [authGuard]

      },
      {
        path: 'status-compra/editar-status-compra/:edit/:id',
        component: EditarStatusCompraComponent,
        data: { titulo: 'Editar status compra' },
        canActivate: [authGuard]

      },
      {
        path: 'roles/editar-rol/:edit/:id',
        component: EditarRolComponent,
        data: { titulo: 'Editar rol' },
        canActivate: [authGuard]

      },
      {
        path: 'roles/crear-rol',
        component: CrearRolComponent,
        data: { titulo: 'Crear rol' },
        canActivate: [authGuard]

      },
      {
        path: 'roles/vista-roles',
        component: VistaRolesComponent,
        data: { titulo: 'Vista roles' },
        canActivate: [authGuard]

      },
      {
        path: 'grupos/editar-grupo/:edit/:id',
        component: EditarGrupoComponent,
        data: { titulo: 'Editar grupo' },
        canActivate: [authGuard]

      },
      {
        path: 'grupos/crear-grupo',
        component: CrearGrupoComponent,
        data: { titulo: 'Crear grupo' },
        canActivate: [authGuard]

      },
      {
        path: 'grupos/vista-grupos',
        component: VistaGruposComponent,
        data: { titulo: 'Vista grupos' },
        canActivate: [authGuard]

      },
      {
        path: 'invitaciones/editar-invitacion/:edit/:id',
        component: EditarInvitacionComponent,
        data: { titulo: 'Editar invitación' },
        canActivate: [authGuard]

      },
      {
        path: 'invitaciones/crear-invitacion/:fiesta',
        component: CrearInvitacionComponent,
        data: { titulo: 'Crear invitacion' },
        canActivate: [authGuard]

      },
      {
        path: 'invitaciones/vista-invitaciones',
        component: VistaInvitacionesComponent,
        data: { titulo: 'Vista invitaciones' },
        canActivate: [authGuard]

      },
      {
        path: 'eventos/editar-evento/:edit/:id',
        component: EditarEventoComponent,
        data: { titulo: 'Editar evento' },
        canActivate: [authGuard]

      },
      {
        path: 'eventos/crear-evento',
        component: CrearEventoComponent,
        data: { titulo: 'Crear evento' },
        canActivate: [authGuard]

      },
      {
        path: 'eventos/vista-eventos',
        component: VistaEventosComponent,
        data: { titulo: 'Vista eventos' }

      },

      {
        path: 'tipo-modulos/editar-tipo-modulo/:edit/:id',
        component: EditarTipoModuloComponent,
        data: { titulo: 'Editar tipo-modulo' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-modulos/crear-tipo-modulo',
        component: CrearTipoModuloComponent,
        data: { titulo: 'Crear tipo-modulo' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-modulos/vista-tipo-modulos',
        component: VistaTipoModulosComponent,
        data: { titulo: 'Vista tipo-modulos' }

      },

      {
        path: 'compras/editar-compra/:edit/:id',
        component: EditarCompraComponent,
        data: { titulo: 'Editar compra' },
        canActivate: [authGuard]

      },
      {
        path: 'compras/crear-compra/:usuario',
        component: CrearCompraComponent,
        data: { titulo: 'Crear compra' },
        canActivate: [authGuard]

      },
      {
        path: 'compras/vista-compras',
        component: VistaEventosComponent,
        data: { titulo: 'Vista compras' }

      },
      {
        path: 'tipo-cantidad/editar-tipo-cantidad/:edit/:id',
        component: EditarTipoCantidadComponent,
        data: { titulo: 'Editar tipo-cantidad' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-cantidad/crear-tipo-cantidad',
        component: CrearTipoCantidadComponent,
        data: { titulo: 'Crear tipo-cantidad' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-cantidad/vista-tipo-cantidades',
        component: VistaTipoCantidadComponent,
        data: { titulo: 'Vista tipo-cantidads' }

      },
      {
        path: 'salones/editar-salon/:edit/:id',
        component: EditarSalonComponent,
        data: { titulo: 'Editar salon' },
        canActivate: [authGuard]

      },
      {
        path: 'salones/crear-salon',
        component: CrearSalonComponent,
        data: { titulo: 'Crear salon' },
        canActivate: [authGuard]

      },
      {
        path: 'salones/registrar-salon',
        component: RegistarSalonComponent,
        data: { titulo: 'Registrar salon' },
        canActivate: [authGuard]

      },
      {
        path: 'salones/vista-salones',
        component: VistaSalonesComponent,
        data: { titulo: 'Vista salones' },
        canActivate: [authGuard]

      },
      {
        path: 'fiestas/editar-fiesta/:edit/:id',
        component: EditarFiestaComponent,
        data: { titulo: 'Editar fiesta' },
        canActivate: [authGuard]

      },
      {
        path: 'fiestas/crear-fiesta',
        component: CrearFiestaComponent,
        data: { titulo: 'Crear fiesta' },
        canActivate: [authGuard]

      },
      {
        path: 'fiestas/vista-fiestas',
        component: VistaFiestasComponent,
        data: { titulo: 'Vista fiestas' },
        canActivate: [authGuard]

      },
      {
        path: 'check-in',
        component: CheckInComponent,
        data: { titulo: 'Check in ' },
        canActivate: [authGuard]

      },
      {
        path: 'boletos/editar-boleto/:edit/:id',
        component: EditarBoletoComponent,
        data: { titulo: 'Editar boleto' },
        canActivate: [authGuard]

      },
      {
        path: 'agregar-invitado/:edit/:id',
        component: EditarBoletoComponent,
        data: { titulo: 'Editar boleto' },
        canActivate: [authGuard]

      },
      {
        path: 'boletos/crear-boleto',
        component: CrearBoletoComponent,
        data: { titulo: 'Crear boleto' },
        canActivate: [authGuard]

      },
      {
        path: 'boletos/vista-boletos',
        component: VistaBoletosComponent,
        data: { titulo: 'Vista boletos' },
        canActivate: [authGuard]

      },

      {
        path: 'invitaciones',
        component: InvitacionesComponent,
        data: { titulo: 'Invitaciones' },


      },
      {
        path: 'invitaciones/bodas/boda1',
        component: Boda1Component,
        data: { titulo: 'Boda1' },


      },
      {
        path: 'invitaciones/default/:fiesta/:invitado/:boleto',
        component: DefaultComponent,
        data: { titulo: 'Default' },


      },
      {
        path: 'invitaciones/xv/xv1/:fiesta/:boleto',
        component: Xv1Component,
        data: { titulo: 'XV1' },


      },
      {
        path: 'invitaciones/xv/xv2/:fiesta/:boleto',
        component: Xv2Component,
        data: { titulo: 'XV' },


      },
      {
        path: 'invitaciones/pc/pc1/:fiesta/:boleto',
        component: Pc1Component,
        data: { titulo: 'Primera comunion' },


      },
      {
        path: 'galeria/:fiesta/:boleto',
        component: GaleriaComponent,
        data: { titulo: 'Sube tu foto' }

      },
      {
        path: 'info-fiesta/:id',
        component: InfoFiestaComponent,
        data: { titulo: 'Información fiesta' }

      },
      {
        path: 'comprar-paquete/:usuario',
        component: ComprarPaqueteComponent,
        data: { titulo: 'Comprar paquete' }

      },
      {
        path: 'templates/default/:fiesta',
        component: DefaultComponent,
        data: { titulo: 'Invitacion fiesta' }

      },
      {
        path: 'templates/default',
        component: DefaultComponent,
        data: { titulo: 'Template default' }

      },
      {
        path: 'templates/default/:fiesta/:boleto',
        component: DefaultComponent,
        data: { titulo: 'Template default' }

      },

    ]
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
