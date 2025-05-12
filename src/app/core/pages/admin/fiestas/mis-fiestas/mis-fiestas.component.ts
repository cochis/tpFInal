import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { CargarBoletos, CargarPaquetes, CargarSalons, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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
import { Paquete } from 'src/app/core/models/paquete.model';
import { PaquetesService } from 'src/app/core/services/paquete.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-mis-fiestas',
  templateUrl: './mis-fiestas.component.html',
  styleUrls: ['./mis-fiestas.component.scss']
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
  paquetes: Paquete[] = []
  urlT = environment.text_url
  usuario: any
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
  cantidadFiestas = 0
  cantidadGalerias = 0
  example: boolean = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  nPush = 0
  constructor(
    private fiestasService: FiestasService,
    private usuariosService: UsuariosService,
    private paquetesServices: PaquetesService,
    private functionsService: FunctionsService,
    private boletosService: BoletosService,
    private salonesService: SalonsService,
    private fileService: FileService,
    private tokenPushService: TokenPushsService,
    private metaService: MetaService
  ) {

    this.loading = true
    this.getUsuario(this.uid)
    setTimeout(() => {
      this.getFiestas()
    }, 1000);
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


    this.paquetesServices.cargarPaquetesAll().subscribe((resp: CargarPaquetes) => {
      this.paquetes = resp.paquetes

    })


    this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
      this.salonesDB = resp.salons
    })
    this.usuariosService.cargarUsuarioById(uid).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
      this.cantidadFiestas = this.usuario.cantidadFiestas
      this.cantidadGalerias = this.usuario.cantidadGalerias
      this.calcularItems(this.usuario.compras)
    })

  }
  async getFiestas() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.fiestasService.cargarFiestasAll().subscribe(resp => {
        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestas = this.fiestas.filter(res => {

          return res.example == this.example
        })

        this.fiestasTemp = this.fiestas

        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {

            this.boletos[i].boletos = this.functionsService.getActivos(res.boleto)

          })
        });
      })
    } else if (this.rol === this.URS) {
      this.fiestasService.cargarFiestasByanfitrion(this.usuario.uid).subscribe(resp => {
        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestas = this.fiestas.filter(res => {

          return res.example == this.example
        })
        this.fiestasTemp = this.fiestas

        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {

            this.boletos[i].boletos = this.functionsService.getActivos(res.boleto)

          })
        });

      })
    } else if (this.rol === this.CHK) {


      this.fiestasService.cargarFiestasBySalon(this.usuario.salon[0]._id).subscribe(resp => {
        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestasTemp = this.fiestas

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
    } else if (this.rol === this.SLN) {
      this.fiestasService.cargarFiestasByEmail(this.usuario.uid).subscribe(resp => {
        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestasTemp = this.fiestas

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
    } else {

      this.fiestasService.cargarFiestasByanfitrion(this.usuario.uid).subscribe(resp => {
        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestasTemp = this.fiestas
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
          console.error('Error', err)
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
    this.loading = true
    var np = 0
    this.nPush = boletos.length
    boletos.forEach((boleto, i) => {

      this.fiestasService.cargarFiestaById(boleto.fiesta).subscribe(resp => {

        let fiesta = resp.fiesta
        let img = fiesta.img
        let galeriaOk = false
        let recordatorio = fiesta.recordatorio.trim().toUpperCase()
        if (recordatorio.includes('@@LIGA_GALERIA@@')) {
          galeriaOk = true
        }


        let invi = resp.fiesta.invitacion.trim()
        let invitado = boleto.nombreGrupo.trim().toUpperCase()
        let evento = fiesta.nombre.trim().toUpperCase()
        let cantidad = boleto.cantidadInvitados
        let mesa = boleto.mesa
        let cantidadBoletos = (boleto.cantidadInvitados > 1) ? "BOLETOS" : "BOLETO"

        let fecha = this.functionsService.datePush(fiesta.fecha)
        let liga = "/shared?evt=" + boleto.shared
        let ligaGaleria = `/core/galeria/fst/${fiesta.uid}/blt/${boleto.uid}`
        recordatorio = recordatorio.replace("@@INVITADO@@", invitado)
        recordatorio = recordatorio.replace("@@FECHA_EVENTO@@", fecha)
        recordatorio = recordatorio.replace("@@CANTIDADINVITADOS@@", cantidad)
        recordatorio = recordatorio.replace("@@MESA@@", mesa)
        recordatorio = recordatorio.replace('@@LIGA_GALERIA@@', ligaGaleria)

        recordatorio = recordatorio.replace("@@BOLETOS@@", cantidadBoletos)



        if (boleto.activated) {
          let fiesta = this.fiestas.filter(fst => {
            return fst.uid == boleto.fiesta
          })
          let push = {

            "notification": {
              "title": evento,
              "body": recordatorio,
              "vibrate": [
                100,
                50,
                100
              ],
              "icon": this.tUrl + "assets/images/qr.jpeg",
              "image": this.url + "/upload/fiestas/" + img,
              "data": {
                "onActionClick": {
                  "default": {
                    "operation": "openWindow",
                    "url": (!galeriaOk) ? liga : ligaGaleria
                  }
                }
              }
            }
          }
          this.tokenPushService.sendTokenPushsByBoleto(boleto.uid, push).subscribe(resp => {
            np = np + 1
            if (np === this.nPush) {
              this.loading = false
              this.functionsService.alert(np + " Notificaciones enviadas", "Recuerda pedir a tus invitados que activen las notificaciones en su invitación", "success")
            }
          },
            (err) => {
              console.error('Error', err)
              this.functionsService.alertError(err, 'Push Notifiactions')
            })
        }
      })
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
  calcularItems(items) {
    this.cantidadFiestas = this.cantidadFiestas
    this.cantidadGalerias = this.cantidadGalerias
    items.forEach((compra, i) => {
      compra.uso.forEach(us => {
        this.paquetes.forEach(paq => {
          if (paq.uid == us.infoPaq._id) {
            if (paq.tipo == 'eventos') {
              this.cantidadFiestas += (Number(us.cantidad))
              this.cantidadFiestas -= Number(us.cantidadUsada)
            } else {
              this.cantidadGalerias += (Number(us.cantidad))
              this.cantidadGalerias -= Number(us.cantidadUsada)
            }
          }
        });
      });
    });
    setTimeout(() => {
      this.cantidadGalerias = this.cantidadGalerias
      this.cantidadFiestas = this.cantidadFiestas
    }, 500);
  }
  viewEjemplos(example) {

    this.example = example

    this.getFiestas()
  }
}
