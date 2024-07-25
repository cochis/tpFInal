import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { CargarBoletos, CargarSalons, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FileService } from 'src/app/core/services/file.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

import { Observable, Subscription, interval } from 'rxjs';
import { TokenPushsService } from 'src/app/core/services/tokenPush.service';
import { environment } from 'src/environments/environment';
import { MetaService } from 'src/app/core/services/meta.service';
@Component({
  selector: 'app-mis-fiestas',
  templateUrl: './mis-fiestas.component.html',
  styleUrls: ['./mis-fiestas.component.css']
})
export class MisFiestasComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false
  uid = this.functionsService.getLocal('uid')
  fiestas: Fiesta[] = []
  fiestasTemp: Fiesta[] = []
  boletos: any = []
  blts: any = []
  blt: any = []
  salones: Salon[] = []
  salonesDB: Salon[] = []
  usuario: Usuario
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  CHK = environment.chk_role
  url = environment.base_url
  rol = this.functionsService.getLocal('role')
  tUrl = environment.text_url
  today = this.functionsService.getToday()
  filter = ''
  src1 = interval(10000);
  obs1: Subscription;
  public imagenSubir!: File
  public imgTemp: any = undefined
  constructor(
    private fiestasService: FiestasService,
    private usuariosService: UsuariosService,
    private functionsService: FunctionsService,
    private boletosService: BoletosService,
    private salonesService: SalonsService,
    private fileService: FileService,
    private tokenPushService: TokenPushsService,
    private metaService: MetaService
  ) {
    this.metaService.createCanonicalURL()
    let data = {
      title: 'Ticket Party  | Mis Fiestas',
      description:
        'Visualiza tus eventos en tiempo real, cuantas invitaciones creaste, cuantos lugares tienes disponibles u ocupados, cuantos confirmaron  cuantos están en el evento o puedes enviar las notificaciones push.',
      keywords:
        'Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
      slug: 'mis-fiestas',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/img/logo/l_100.png',
    }
    this.metaService.generateTags(data)

    this.loading = true
    this.getUsuario(this.uid)
    setTimeout(() => {
      this.getFiestas()
    }, 800);
  }
  ngOnInit() {
    this.filterBy('true')
    this.obs1 = this.src1.subscribe((value: any) => {
      this.loading = true
      this.boletos = []
      this.getFiestas()
    });
  }
  ngAfterViewInit() {
  }
  ngOnDestroy(): void {
    this.boletos = []
    if (this.obs1) this.obs1.unsubscribe();
  }
  getUsuario(uid) {
    this.usuariosService.cargarUsuarioById(uid).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
    })
    this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
      this.salonesDB = resp.salons
    })
  }
  async getFiestas() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.fiestasService.cargarFiestasAll().subscribe(resp => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            this.boletos[i].boletos = this.functionsService.getActivos(res.boleto)
            // console.log('this.boletos[i]', this.boletos[i])
          })
        });
      })
    } else if (this.rol === this.URS) {
      this.fiestasService.cargarFiestasByanfitrion(this.usuario.uid).subscribe(resp => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            this.boletos[i].boletos = this.functionsService.getActivos(res.boleto)
            // console.log('this.boletos', this.boletos)
          })
        });

      })
    } else if (this.rol === this.CHK) {
      this.fiestasService.cargarFiestasBySalon(this.usuario.salon[0]).subscribe(resp => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            // console.log('res', res)
            this.boletos[i].boletos = res.boleto
          })
        });
      })
    } else if (this.rol === this.SLN) {
      this.fiestasService.cargarFiestasByEmail(this.usuario.uid).subscribe(resp => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            // console.log('res', res)
            this.boletos[i].boletos = res.boleto
          })
        });
      })
    } else {

      this.fiestasService.cargarFiestasByanfitrion(this.usuario.uid).subscribe(resp => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            this.boletos[i].boletos = res.boleto
          })
        });
      })
    }
    this.loading = false
  }
  getBoleto(id: string) {
    this.boletosService.cargarBoletoByFiesta(id).subscribe((resp) => {
      let bl = {
        id: id,
        boletos: resp.boleto[0]
      }
      this.boletos.forEach((b, i) => {
        if (b.id === id) {
          this.boletos[i].boletos = resp.boleto[0]
        } else {
          this.boletos.push(bl)
        }
      });
      return this.boletos
    })
  }
  getSalon(id: string) {
    this.salonesService.cargarSalonById(id).subscribe((resp: any) => {
      let sl = resp.salon[0]
      if (resp) this.salones.push(sl)
      return this.salones
    })
  }
  gettotal(invitados, type: string) {
    var total = 0
    switch (type) {
      case 'ocupados':
        invitados.forEach(invitado => {
          if (invitado.activated) {
            total = total + invitado.cantidadInvitados
          }
        });
        break;
      default:
        break;
    }
    invitados.forEach((c: any) => {
    });
    return total
  }
  getConfirmados(invitados) {
    var total = 0
    invitados.forEach((c: any) => {
      if (c.confirmado) {
        total = total + 1
      }
    });
    return total
  }
  getOnParty(invitados) {
    var total = 0
    invitados.forEach((c: any) => {
      if (c.ocupados && c.activated) {
        total = total + c.ocupados
      }
    });
    return total
  }
  getActivas(invitados) {
    var total = 0
    invitados.forEach((c: any) => {
      if (c.activated) {
        total = total + 1
      }
    });
    return total
  }
  setInvitados(fiesta: string) {
    this.functionsService.navigateTo(`core/agregar-invitado/true/${fiesta}`)
  }
  cambiarImagen(file: any, fiesta: any, i: number) {
    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null
    } else {
      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result
      }
      this.subirImagen(fiesta)
    }
  }
  subirImagen(fiesta) {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'fiestas', fiesta.uid)
      .then(
        (img) => {
          fiesta.img = img
          this.functionsService.alertUpdate('Imagen actualizada')
        },
        (err) => {
          this.functionsService.alertError(err, 'Subir imagen')
        },
      )
  }
  filterBy(type: string) {
    this.filter = type
    switch (this.filter) {
      case 'true':
        this.fiestas = this.functionsService.getActivos(this.fiestasTemp)
        break;
      case 'false':
        this.fiestas = this.functionsService.getNoActivos(this.fiestasTemp)
        break;
      case 'finalizadas':
        this.fiestas = this.functionsService.getFinished(this.fiestasTemp)
        break;
      default:
        this.fiestas = this.fiestasTemp
        break;
    }
  }
  enviarPush(boletos) {
    boletos.forEach(boleto => {
      if (boleto.activated) {
        let fiesta = this.fiestas.filter(fst => {
          return fst.uid == boleto.fiesta
        })
        let push = {
          "notification": {
            "title": "Hola " + boleto.nombreGrupo + ", recuerda que mi evento es el  " + this.functionsService.datePush(fiesta[0].fecha),
            "body": fiesta[0].nombre,
            "vibrate": [
              100,
              50,
              100
            ],
            "icon": this.tUrl + "assets/images/qr.jpeg",
            "image": this.url + "/upload/fiestas/" + fiesta[0].img,
            "data": {
              "onActionClick": {
                "default": {
                  "operation": "openWindow",
                  "url": "/core/templates/default/" + boleto.fiesta + "/" + boleto.uid
                }
              }
            }
          }
        }
        this.tokenPushService.sendTokenPushsByBoleto(boleto.uid, push).subscribe(resp => {
          this.functionsService.alert("Notificaciones enviadas", "Recuerda pedir a tus invitados que activen las notificaciones en su invitación", "success")
        },
          (err) => {
            this.functionsService.alertError(err, 'Push Notifiactions')
          })
      }

    });

    if (boletos.length == 0) {
      this.functionsService.alert("Importante", "Recuerda pedir a tus invitados que activen las notificaciones en su invitación", "info")
    }
  }
  typeOf(val) {
    return typeof (val)
  }
  getCatalog(tipo: string, id: string) {
    if (id === undefined) return
    switch (tipo) {
      case 'fiesta':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.fiestas)
        break;
      case 'salon':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.salonesDB)
        break;
      default:
        return " No se encontró"
        break
    }
  }
}
