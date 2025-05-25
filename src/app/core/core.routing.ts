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
import { ByImagesComponent } from './pages/admin/templates/by-images/by-images.component';
import { BorradoComponent } from './pages/admin/borrado/borrado.component';
import { EditarTipoCentroComponent } from './pages/admin/tipo-centros/editar-tipo-centro/editar-tipo-centro.component';
import { CrearTipoCentroComponent } from './pages/admin/tipo-centros/crear-tipo-centro/crear-tipo-centro.component';
import { VistaTipoCentrosComponent } from './pages/admin/tipo-centros/vista-tipo-centros/vista-tipo-centros.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { VistaPaquetesComponent } from './pages/admin/paquete/vista-paquetes/vista-paquetes.component';
import { EditarPaqueteComponent } from './pages/admin/paquete/editar-paquete/editar-paquete.component';
import { CrearPaqueteComponent } from './pages/admin/paquete/crear-paquete/crear-paquete.component';
import { CongratsComponent } from '../shared/pages/congrats/congrats.component';
import { CancelComponent } from '../shared/pages/cancel/cancel.component';
import { PoliticaDePrivacidadComponent } from './pages/politica-de-privacidad/politica-de-privacidad.component';
import { TerminosYCondicionesComponent } from './pages/terminos-y-condiciones/terminos-y-condiciones.component';
import { EditarParametroComponent } from './pages/admin/parametros/editar-parametro/editar-parametro.component';
import { CrearParametroComponent } from './pages/admin/parametros/crear-parametro/crear-parametro.component';
import { VistaParametrosComponent } from './pages/admin/parametros/vista-parametros/vista-parametros.component';
import { ByFileComponent } from './pages/admin/templates/by-file/by-file.component';
import { EjemplosComponent } from './pages/ejemplos/ejemplos.component';
import { SingleFiestaComponent } from './pages/admin/fiestas/single-fiesta/single-fiesta.component';
import { EditarEjemploComponent } from './pages/admin/ejemplos/editar-ejemplo/editar-ejemplo.component';
import { CrearEjemploComponent } from './pages/admin/ejemplos/crear-ejemplo/crear-ejemplo.component';
import { VistaEjemplosComponent } from './pages/admin/ejemplos/vista-ejemplos/vista-ejemplos.component';
import { MarketComponent } from './pages/market/market.component';
import { SingleProductComponent } from './pages/market/views/single-product/single-product.component';
import { SingleCategoryComponent } from './pages/market/views/single-category/single-category.component';
import { SingleSupplierComponent } from './pages/market/views/single-supplier/single-supplier.component';
import { CarritoComponent } from './pages/admin/market/carrito/carrito.component';
import { EditarTipoColorComponent } from './pages/admin/tipo-colores/editar-tipo-color/editar-tipo-color.component';
import { CrearTipoColorComponent } from './pages/admin/tipo-colores/crear-tipo-color/crear-tipo-color.component';
import { VistaTipoColoresComponent } from './pages/admin/tipo-colores/vista-tipo-colores/vista-tipo-colores.component';
import { EditarTipoContactoComponent } from './pages/admin/tipo-contactos/editar-tipo-contacto/editar-tipo-contacto.component';
import { CrearTipoContactoComponent } from './pages/admin/tipo-contactos/crear-tipo-contacto/crear-tipo-contacto.component';
import { VistaTipoContactosComponent } from './pages/admin/tipo-contactos/vista-tipo-contactos/vista-tipo-contactos.component';
import { EditarProvedorComponent } from './pages/admin/market/admin/proveedors/editar-provedor/editar-provedor.component';
import { CrearProvedorComponent } from './pages/admin/market/admin/proveedors/crear-provedor/crear-provedor.component';
import { VistaProvedorsComponent } from './pages/admin/market/admin/proveedors/vista-provedors/vista-provedors.component';
import { EditarItemComponent } from './pages/admin/market/admin/items/editar-item/editar-item.component';
import { CrearItemComponent } from './pages/admin/market/admin/items/crear-item/crear-item.component';
import { VistaItemsComponent } from './pages/admin/market/admin/items/vista-items/vista-items.component';
import { VistaTipoItemsComponent } from './pages/admin/tipo-items/vista-tipo-items/vista-tipo-items.component';
import { CrearTipoItemComponent } from './pages/admin/tipo-items/crear-tipo-item/crear-tipo-item.component';
import { EditarTipoItemComponent } from './pages/admin/tipo-items/editar-tipo-item/editar-tipo-item.component';
import { EditarCategoriaItemComponent } from './pages/admin/categoria-items/editar-categoria-item/editar-categoria-item.component';
import { CrearCategoriaItemComponent } from './pages/admin/categoria-items/crear-categoria-item/crear-categoria-item.component';
import { VistaCategoriaItemsComponent } from './pages/admin/categoria-items/vista-categoria-items/vista-categoria-items.component';
import { EditarMonedaComponent } from './pages/admin/monedas/editar-moneda/editar-moneda.component';
import { CrearMonedaComponent } from './pages/admin/monedas/crear-moneda/crear-moneda.component';
import { VistaMonedasComponent } from './pages/admin/monedas/vista-monedas/vista-monedas.component';
import { EditarTipoMediaComponent } from './pages/admin/tipo-medias/editar-tipo-media/editar-tipo-media.component';
import { CrearTipoMediaComponent } from './pages/admin/tipo-medias/crear-tipo-media/crear-tipo-media.component';
import { VistaTipoMediasComponent } from './pages/admin/tipo-medias/vista-tipo-medias/vista-tipo-medias.component';
import { CrearCpComponent } from './pages/admin/cps/crear-cp/crear-cp.component';
import { EditarCpComponent } from './pages/admin/cps/editar-cp/editar-cp.component';
import { VistaCpsComponent } from './pages/admin/cps/vista-cps/vista-cps.component';
import { EditarPaisComponent } from './pages/admin/paises/editar-pais/editar-pais.component';
import { CrearPaisComponent } from './pages/admin/paises/crear-pais/crear-pais.component';
import { VistaPaisesComponent } from './pages/admin/paises/vista-paises/vista-paises.component';
import { VistaEstatusCotizacionesComponent } from './pages/admin/estatus-cotizaciones/vista-estatus-cotizaciones/vista-estatus-cotizaciones.component';
import { EditarEstatusCotizacionComponent } from './pages/admin/estatus-cotizaciones/editar-estatus-cotizacion/editar-estatus-cotizacion.component';
import { CrearEstatusCotizacionComponent } from './pages/admin/estatus-cotizaciones/crear-estatus-cotizacion/crear-estatus-cotizacion.component';
import { MisCotizacionesComponent } from './pages/admin/cotizaciones/mis-cotizaciones/mis-cotizaciones.component';
import { MiCotizacionComponent } from './pages/admin/cotizaciones/mi-cotizacion/mi-cotizacion.component';
import { EditarDatosComponent } from './pages/admin/market/admin/proveedors/editar-datos/editar-datos.component';
import { CalificacionComponent } from './pages/admin/market/admin/items/calificacion/calificacion.component';
import { ProveedoresComponent } from './pages/market/views/proveedores/proveedores.component';
import { EditarTipoUbicacionComponent } from './pages/admin/tipo-ubicaciones/editar-tipo-ubicacion/editar-tipo-ubicacion.component';
import { CrearTipoUbicacionComponent } from './pages/admin/tipo-ubicaciones/crear-tipo-ubicacion/crear-tipo-ubicacion.component';
import { VistaTipoUbicacionesComponent } from './pages/admin/tipo-ubicaciones/vista-tipo-ubicaciones/vista-tipo-ubicaciones.component';
import { CrearPromoComponent } from './pages/admin/promos/crear-promo/crear-promo.component';
import { EditarRedComponent } from './pages/admin/redes/editar-red/editar-red.component';
import { CrearRedComponent } from './pages/admin/redes/crear-red/crear-red.component';
import { VistaRedesComponent } from './pages/admin/redes/vista-redes/vista-redes.component';
import { EditarEmailTemplateComponent } from './pages/admin/email-templates/editar-email-template/editar-email-template.component';
import { CrearEmailTemplateComponent } from './pages/admin/email-templates/crear-email-template/crear-email-template.component';
import { VistaEmailTemplatesComponent } from './pages/admin/email-templates/vista-email-templates/vista-email-templates.component';
import { NewStyleComponent } from './pages/admin/templates/new-style/new-style.component';
import { EditarFondoComponent } from './pages/admin/fondos/editar-fondo/editar-fondo.component';
import { CrearFondoComponent } from './pages/admin/fondos/crear-fondo/crear-fondo.component';
import { VistaFondosComponent } from './pages/admin/fondos/vista-fondos/vista-fondos.component';
import { ParralaxComponent } from './pages/admin/templates/parralax/parralax.component';
import { CrearPostComponent } from './pages/admin/posts/crear-post/crear-post.component';
import { EditarPostComponent } from './pages/admin/posts/editar-post/editar-post.component';
import { VistaPostsComponent } from './pages/admin/posts/vista-posts/vista-posts.component';
import { BlocComponent } from './pages/bloc/bloc.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
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
        path: 'inicio',
        component: HomeComponent,
        data: { titulo: 'Home' }

      },
      {
        path: 'about',
        component: AboutComponent,
        data: { titulo: 'Quienes somos' }

      },
      {
        path: 'blog',
        component: BlocComponent,
        data: { titulo: 'Quienes somos' }

      },
      {
        path: 'examples',
        component: EjemplosComponent,
        data: { titulo: 'Ejemplos' }

      },
      {
        path: 'faqs',
        component: FaqsComponent,
        data: { titulo: 'Preguntas frecuentes' }

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
        path: 'politica-de-privacidad',
        component: PoliticaDePrivacidadComponent,
        data: { titulo: 'Política de privacidad' }

      },
      {
        path: 'terminos-y-condiciones',
        component: TerminosYCondicionesComponent,
        data: { titulo: 'Términos y condiciones' }

      },
      {
        path: 'mis-fiestas',
        component: MisFiestasComponent,
        data: { titulo: 'Mis fiestas' },
        canActivate: [authGuard]
      },
      {
        path: 'borrado',
        component: BorradoComponent,
        data: { titulo: 'Borrado' },
        canActivate: [authGuard]
      },
      {
        path: 'promos',
        component: CrearPromoComponent,
        data: { titulo: 'promo' },
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
        path: 'tipo-centros/editar-tipo-centro/:edit/:id',
        component: EditarTipoCentroComponent,
        data: { titulo: 'Editar tipo centro' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-centros/crear-tipo-centro',
        component: CrearTipoCentroComponent,
        data: { titulo: 'Crear tipo centro' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-centros/vista-tipo-centros',
        component: VistaTipoCentrosComponent,
        data: { titulo: 'Vista tipo centros' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-colores/editar-tipo-color/:edit/:id',
        component: EditarTipoColorComponent,
        data: { titulo: 'Editar tipo color' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-colores/crear-tipo-color',
        component: CrearTipoColorComponent,
        data: { titulo: 'Crear tipo color' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-colores/vista-tipo-colores',
        component: VistaTipoColoresComponent,
        data: { titulo: 'Vista tipo colores' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-contactos/editar-tipo-contacto/:edit/:id',
        component: EditarTipoContactoComponent,
        data: { titulo: 'Editar tipo contacto' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-contactos/crear-tipo-contacto',
        component: CrearTipoContactoComponent,
        data: { titulo: 'Crear tipo contacto' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-contactos/vista-tipo-contactos',
        component: VistaTipoContactosComponent,
        data: { titulo: 'Vista tipo contactos' },
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

      //Eventos
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
      //Post
      {
        path: 'posts/editar-post/:edit/:id',
        component: EditarPostComponent,
        data: { titulo: 'Editar post' },
        canActivate: [authGuard]

      },
      {
        path: 'posts/crear-post',
        component: CrearPostComponent,
        data: { titulo: 'Crear post' },
        canActivate: [authGuard]

      },
      {
        path: 'posts/vista-posts',
        component: VistaPostsComponent,
        data: { titulo: 'Vista posts' }

      },
      {
        path: 'post/:id',
        component: SinglePostComponent,
        data: { titulo: 'Vista posts' }

      },
      //Fondos
      {
        path: 'fondos/editar-fondo/:edit/:id',
        component: EditarFondoComponent,
        data: { titulo: 'Editar fondo' },
        canActivate: [authGuard]

      },
      {
        path: 'fondos/crear-fondo',
        component: CrearFondoComponent,
        data: { titulo: 'Crear fondo' },
        canActivate: [authGuard]

      },
      {
        path: 'fondos/vista-fondos',
        component: VistaFondosComponent,
        data: { titulo: 'Vista fondos' }

      },
      //Redes
      {
        path: 'redes/editar-red/:edit/:id',
        component: EditarRedComponent,
        data: { titulo: 'Editar red' },
        canActivate: [authGuard]

      },
      {
        path: 'redes/crear-red',
        component: CrearRedComponent,
        data: { titulo: 'Crear red' },
        canActivate: [authGuard]

      },
      {
        path: 'redes/vista-redes',
        component: VistaRedesComponent,
        data: { titulo: 'Vista redes' }

      },
      //Tipo Ubicaciones
      {
        path: 'tipo-ubicaciones/editar-tipo-ubicacion/:edit/:id',
        component: EditarTipoUbicacionComponent,
        data: { titulo: 'Editar tipo ubicacion' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-ubicaciones/crear-tipo-ubicacion',
        component: CrearTipoUbicacionComponent,
        data: { titulo: 'Crear tipo ubicacion' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-ubicaciones/vista-tipo-ubicaciones',
        component: VistaTipoUbicacionesComponent,
        data: { titulo: 'Vista tipo ubicaciones' }

      },
      //Email Templates
      {
        path: 'email-templates/editar-email-template/:edit/:id',
        component: EditarEmailTemplateComponent,
        data: { titulo: 'Editar email-template' },
        canActivate: [authGuard]

      },
      {
        path: 'email-templates/crear-email-template',
        component: CrearEmailTemplateComponent,
        data: { titulo: 'Crear email-template' },
        canActivate: [authGuard]

      },
      {
        path: 'email-templates/vista-email-templates',
        component: VistaEmailTemplatesComponent,
        data: { titulo: 'Vista email-templates' }

      },
      //Paises
      {
        path: 'paises/editar-pais/:edit/:id',
        component: EditarPaisComponent,
        data: { titulo: 'Editar pais' },
        canActivate: [authGuard]

      },
      {
        path: 'paises/crear-pais',
        component: CrearPaisComponent,
        data: { titulo: 'Crear pais' },
        canActivate: [authGuard]

      },
      {
        path: 'paises/vista-paises',
        component: VistaPaisesComponent,
        data: { titulo: 'Vista paises' }

      },
      //CPS
      {
        path: 'cps/editar-cp/:edit/:id',
        component: EditarCpComponent,
        data: { titulo: 'Editar cp' },
        canActivate: [authGuard]

      },
      {
        path: 'cps/crear-cp',
        component: CrearCpComponent,
        data: { titulo: 'Crear cp' },
        canActivate: [authGuard]

      },
      {
        path: 'cps/vista-cps',
        component: VistaCpsComponent,
        data: { titulo: 'Vista cps' }

      },





      //ejemplos
      {
        path: 'ejemplos/editar-ejemplo/:edit/:id',
        component: EditarEjemploComponent,
        data: { titulo: 'Editar ejemplo' },
        canActivate: [authGuard]

      },
      {
        path: 'ejemplos/crear-ejemplo',
        component: CrearEjemploComponent,
        data: { titulo: 'Crear ejemplo' },
        canActivate: [authGuard]

      },
      {
        path: 'ejemplos/vista-ejemplos',
        component: VistaEjemplosComponent,
        data: { titulo: 'Vista ejemplos' }

      },
      {
        path: 'parametros/editar-parametro/:edit/:id',
        component: EditarParametroComponent,
        data: { titulo: 'Editar parametro' },
        canActivate: [authGuard]

      },
      {
        path: 'parametros/crear-parametro',
        component: CrearParametroComponent,
        data: { titulo: 'Crear parametro' },
        canActivate: [authGuard]

      },
      {
        path: 'parametros/vista-parametros',
        component: VistaParametrosComponent,
        data: { titulo: 'Vista parametros' }

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
        path: 'monedas/editar-moneda/:edit/:id',
        component: EditarMonedaComponent,
        data: { titulo: 'Editar moneda' },
        canActivate: [authGuard]

      },
      {
        path: 'monedas/crear-moneda',
        component: CrearMonedaComponent,
        data: { titulo: 'Crear moneda' },
        canActivate: [authGuard]

      },
      {
        path: 'monedas/vista-monedas',
        component: VistaMonedasComponent,
        data: { titulo: 'Vista monedas' }

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
        path: 'paquete/vista-paquetes',
        component: VistaPaquetesComponent,
        data: { titulo: 'Vista paquetes' }

      },
      {
        path: 'paquete/editar-paquete/:edit/:id',
        component: EditarPaqueteComponent,
        data: { titulo: 'Editar paquete' },
        canActivate: [authGuard]

      },
      {
        path: 'paquete/crear-paquete',
        component: CrearPaqueteComponent,
        data: { titulo: 'Crear paquete' },
        canActivate: [authGuard]

      },
      {
        path: 'paquete/vista-paquetes',
        component: VistaTipoCantidadComponent,
        data: { titulo: 'Vista paquetes' }

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
        path: 'fiestas/single-fiesta/:id',
        component: SingleFiestaComponent,
        data: { titulo: 'Vista fiesta' },
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
        path: 'templates/by-images/:fiesta',
        component: ByImagesComponent,
        data: { titulo: 'Invitacion fiesta' }

      },
      {
        path: 'templates/by-images',
        component: ByImagesComponent,
        data: { titulo: 'Template by-images' }

      },
      {
        path: 'templates/by-images/:fiesta/:boleto',
        component: ByImagesComponent,
        data: { titulo: 'Template by-images' }

      },
      {
        path: 'invitaciones/pc/pc1/:fiesta/:boleto',
        component: Pc1Component,
        data: { titulo: 'Primera comunion' },


      },
      {
        path: 'galeria/fst/:fiesta/blt/:boleto',
        component: GaleriaComponent,
        data: { titulo: 'Sube tu foto' }

      },
      {
        path: 'galeria/fst/:fiesta',
        component: GaleriaComponent,
        data: { titulo: 'Sube tu foto' }

      },
      {
        path: 'galeria/fst/:fiesta/anf/:anfitrion',
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
        path: 'mis-compras',
        component: VistaComprasComponent,
        data: { titulo: 'Mis compras' }

      },
      {
        path: 'mis-compras/editar-compra/:edit/:id',
        component: EditarCompraComponent,
        data: { titulo: 'Editar compra' },
        canActivate: [authGuard]

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
      {
        path: 'templates/default/:fiesta/:boleto/:copy',
        component: DefaultComponent,
        data: { titulo: 'Template default' }

      },


      //BYFILE
      {
        path: 'templates/byFile',
        component: ByFileComponent,
        data: { titulo: 'Template ByFile' }

      },
      {
        path: 'templates/byFile/:fiesta/:boleto',
        component: ByFileComponent,
        data: { titulo: 'Template ByFile' }

      },
      {
        path: 'templates/byFile/:fiesta/:boleto/:copy',
        component: ByFileComponent,
        data: { titulo: 'Template ByFile' }

      },

      //BYFancy
      {
        path: 'templates/fancy',
        component: NewStyleComponent,
        data: { titulo: 'Template Fancy' }

      },
      {
        path: 'templates/fancy/:fiesta/:boleto',
        component: NewStyleComponent,
        data: { titulo: 'Template Fancy' }

      },
      {
        path: 'templates/fancy/:fiesta/:boleto/:copy',
        component: NewStyleComponent,
        data: { titulo: 'Template Fancy' }

      },
      //BYFancy
      /*  {
         path: 'templates/parralax',
         component: ParralaxComponent,
         data: { titulo: 'Template parralax' }
 
       },
       {
         path: 'templates/parralax/:fiesta/:boleto',
         component: ParralaxComponent,
         data: { titulo: 'Template parralax' }
 
       },
       {
         path: 'templates/parralax/:fiesta/:boleto/:copy',
         component: ParralaxComponent,
         data: { titulo: 'Template parralax' }
 
       },
  */





      {
        path: 'congrats',
        component: CongratsComponent,
        data: { titulo: 'Congrats' }

      },
      {
        path: 'cancel',
        component: CancelComponent,
        data: { titulo: 'Cancel' }

      },
      //Market
      {
        path: 'market',
        component: MarketComponent,
        data: { titulo: 'Market' }

      },
      {
        path: 'market/proveedores',
        component: ProveedoresComponent,
        data: { titulo: 'Proveedores' }

      },
      {
        path: 'vista-producto/:id',
        component: SingleProductComponent,
        data: { titulo: 'Vista Producto' }

      },
      {
        path: 'vista-producto',
        component: SingleProductComponent,
        data: { titulo: 'Vista Producto' }

      },
      {
        path: 'vista-categoria',
        component: SingleCategoryComponent,
        data: { titulo: 'Vista Categoria' }

      },
      {
        path: 'vista-proveedor/:id',
        component: SingleSupplierComponent,
        data: { titulo: 'Vista Proveedor' }

      },
      {
        path: 'vista-proveedor',
        component: SingleSupplierComponent,
        data: { titulo: 'Vista Proveedor' }

      },
      {
        path: 'market/carrito',
        component: CarritoComponent,
        data: { titulo: 'Carrito de compras' }

      },




      //admin 

      //proveedores
      {
        path: 'proveedores/editar-proveedor/:edit/:id',
        component: EditarProvedorComponent,
        data: { titulo: 'Editar proveedor' },
        canActivate: [authGuard]

      },
      {
        path: 'proveedores/crear-proveedor',
        component: CrearProvedorComponent,
        data: { titulo: 'Crear proveedor' },
        canActivate: [authGuard]

      },
      {
        path: 'proveedores/editar-datos',
        component: EditarDatosComponent,
        data: { titulo: 'Editar datos proveedor' },
        canActivate: [authGuard]

      },
      {
        path: 'proveedores/vista-proveedores',
        component: VistaProvedorsComponent,
        data: { titulo: 'Vista proveedores' },
        canActivate: [authGuard]

      },
      //items
      {
        path: 'items/editar-item/:edit/:id',
        component: EditarItemComponent,
        data: { titulo: 'Editar item' },
        canActivate: [authGuard]

      },
      {
        path: 'items/crear-item',
        component: CrearItemComponent,
        data: { titulo: 'Crear item' },
        canActivate: [authGuard]

      },
      {
        path: 'calificacion/productos/:id',
        component: CalificacionComponent,
        data: { titulo: 'Calificacion productos o servicios' }

      },
      {
        path: 'productos/agregar',
        component: CrearItemComponent,
        data: { titulo: 'Crear item' },
        canActivate: [authGuard]

      },
      {
        path: 'items/vista-items',
        component: VistaItemsComponent,
        data: { titulo: 'Vista items' },
        canActivate: [authGuard]

      },
      {
        path: 'mis-productos',
        component: VistaItemsComponent,
        data: { titulo: 'Mis productos' },
        canActivate: [authGuard]

      },

      //tipo-items
      {
        path: 'tipo-items/editar-tipo-item/:edit/:id',
        component: EditarTipoItemComponent,
        data: { titulo: 'Editar item' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-items/crear-tipo-item',
        component: CrearTipoItemComponent,
        data: { titulo: 'Crear item' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-items/vista-tipo-items',
        component: VistaTipoItemsComponent,
        data: { titulo: 'Vista items' },
        canActivate: [authGuard]

      },
      //tipo-medios
      {
        path: 'tipo-medios/editar-tipo-medio/:edit/:id',
        component: EditarTipoMediaComponent,
        data: { titulo: 'Editar medio' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-medios/crear-tipo-medio',
        component: CrearTipoMediaComponent,
        data: { titulo: 'Crear medio' },
        canActivate: [authGuard]

      },
      {
        path: 'tipo-medios/vista-tipo-medios',
        component: VistaTipoMediasComponent,
        data: { titulo: 'Vista medios' },
        canActivate: [authGuard]

      },
      //categoria items
      {
        path: 'categoria-items/editar-categoria-item/:edit/:id',
        component: EditarCategoriaItemComponent,
        data: { titulo: 'Editar categoria item' },
        canActivate: [authGuard]

      },
      {
        path: 'categoria-items/crear-categoria-item',
        component: CrearCategoriaItemComponent,
        data: { titulo: 'Crear categoria item' },
        canActivate: [authGuard]

      },
      {
        path: 'categoria-items/vista-categoria-items',
        component: VistaCategoriaItemsComponent,
        data: { titulo: 'Crear categoria item' },
        canActivate: [authGuard]

      },

      {
        path: 'estatus-cotizaciones/vista-estatus-cotizaciones',
        component: VistaEstatusCotizacionesComponent,
        data: { titulo: 'Vista estatus cotizaciones' },
        canActivate: [authGuard]

      },
      {
        path: 'estatus-cotizaciones/editar-estatus-cotizacion/:edit/:id',
        component: EditarEstatusCotizacionComponent,
        data: { titulo: 'Editar estatus cotizacion' },
        canActivate: [authGuard]

      },
      {
        path: 'estatus-cotizaciones/crear-estatus-cotizacion',
        component: CrearEstatusCotizacionComponent,
        data: { titulo: 'Crear estatus cotizacion' },
        canActivate: [authGuard]

      },
      {
        path: 'mis-cotizaciones',
        component: MisCotizacionesComponent,
        data: { titulo: 'Mis cotizaciones' },
        canActivate: [authGuard]

      },
      {
        path: 'cotizaciones/mi-cotizacion/:id',
        component: MiCotizacionComponent,
        data: { titulo: 'Mis cotizacion' },
        canActivate: [authGuard]

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
