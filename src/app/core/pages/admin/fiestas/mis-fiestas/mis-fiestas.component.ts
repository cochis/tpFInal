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
import { environment } from 'src/environments/environment';
import { Observable, Subscription, interval } from 'rxjs';
import { TokenPushsService } from 'src/app/core/services/tokenPush.service';
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
  usuario: Usuario
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  CHK = environment.chk_role
  url = environment.base_url
  rol = this.functionsService.getLocal('role')
  today = this.functionsService.getToday()
  filter = ''
  src1 = interval(5000);
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
    private tokenPushService: TokenPushsService
  ) {

    this.loading = true
    this.getUsuario(this.uid)
    setTimeout(() => {
      this.getFiestas()
    }, 800);
  }
  ngOnInit() {
    this.filterBy('true')
    // console.log(this.rol);
    // this.obs1 = this.src1.subscribe((value: any) => {

    //   if (this.rol === this.URS) {
    //     this.fiestasService.cargarFiestasByanfitrion(this.uid).subscribe((resp) => {
    //       this.fiestasTemp = resp.fiestas
    //       switch (this.filter) {
    //         case 'true':
    //           this.fiestas = this.functionsService.getActivos(this.fiestasTemp)
    //           break;
    //         case 'false':
    //           this.fiestas = this.functionsService.getNoActivos(this.fiestasTemp)
    //           break;
    //         case 'finalizadas':
    //           this.fiestas = this.functionsService.getFinished(this.fiestasTemp)
    //           break;

    //         default:
    //           this.fiestas = this.fiestasTemp
    //           break;
    //       }
    //       // this.fiestas = this.functionsService.getActivos(resp.fiestas)
    //       this.fiestas = resp.fiestas
    //       this.fiestasTemp = resp.fiestas
    //       this.filterBy('true')
    //       this.fiestas.forEach((fiesta: any) => {
    //         this.getBoleto(fiesta.uid)
    //         this.getSalon(fiesta.salon._id)
    //         setTimeout(() => {
    //           this.loading = false
    //         }, 500);
    //       });
    //     })
    //   }
    //   else if (this.rol === this.SLN || this.rol === this.ANF) {
    //     // console.log('this.usuario.salon::: ', this.usuario.salon);
    //     this.usuario.salon.forEach(salon => {

    //       this.fiestasService.cargarFiestasBySalon(salon).subscribe((resp) => {
    //         this.fiestas = resp.fiestas
    //         // console.log('resp.fiestas::: ', resp.fiestas);
    //         this.fiestasTemp = resp.fiestas
    //         switch (this.filter) {
    //           case 'true':
    //             this.fiestas = this.functionsService.getActivos(this.fiestasTemp)
    //             break;
    //           case 'false':
    //             this.fiestas = this.functionsService.getNoActivos(this.fiestasTemp)
    //             break;
    //           case 'finalizadas':
    //             this.fiestas = this.functionsService.getFinished(this.fiestasTemp)
    //             break;

    //           default:
    //             this.fiestas = this.fiestasTemp
    //             break;
    //         }
    //         this.filterBy('true')

    //         this.fiestas.forEach((fiesta: any) => {


    //           this.getBoleto(fiesta.uid)
    //           this.getSalon(fiesta.salon._id)
    //           setTimeout(() => {

    //             this.loading = false
    //           }, 1500);
    //         });
    //       })
    //     });
    //   }
    //   else if (this.rol === this.ADM) {

    //     this.fiestasService.cargarFiestasAll().subscribe((resp) => {
    //       this.fiestasTemp = resp.fiestas
    //       switch (this.filter) {
    //         case 'true':
    //           this.fiestas = this.functionsService.getActivos(this.fiestasTemp)
    //           break;
    //         case 'false':
    //           this.fiestas = this.functionsService.getNoActivos(this.fiestasTemp)
    //           break;
    //         case 'finalizadas':
    //           this.fiestas = this.functionsService.getFinished(this.fiestasTemp)
    //           break;
    //         default:
    //           this.fiestas = this.fiestasTemp
    //           break;
    //       }
    //       this.fiestas.forEach((fiesta: any) => {
    //         this.getBoleto(fiesta.uid)
    //         this.getSalon(fiesta.salon)
    //         setTimeout(() => {
    //           this.loading = false
    //         }, 1500);
    //       });
    //     })
    //   }
    // });
  }
  ngAfterViewInit() {
  }
  ngOnDestroy(): void {

    if (this.obs1) this.obs1.unsubscribe();
  }
  getUsuario(uid) {
    this.usuariosService.cargarUsuarioById(uid).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
      // console.log('this.usuario::: ', this.usuario);

    })
  }
  async getFiestas() {
    this.loading = true
    if (this.rol === 'ADMROL') {
      this.fiestasService.cargarFiestasAll().subscribe(resp => {
        this.fiestas = resp.fiestas

        console.log(' this.fiestas::: ', this.fiestas);
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          // console.log('   this.blt ::: ', fst.uid);
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            // console.log('res ::: ', res);
            this.boletos[i].boletos = res.boleto
          })
        });
        // console.log('this.boletos::: ', this.boletos);
      })
    } else if (this.rol === 'USRROl') {

    } else if (this.rol === 'CHCROL') {
      console.log(this.usuario);
      this.fiestasService.cargarFiestasBySalon(this.usuario.salon[0]).subscribe(resp => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.fiestas.forEach((fst, i) => {
          this.blt = {
            fiesta: fst,
            boletos: []
          }
          this.boletos.push(this.blt)
          // console.log('   this.blt ::: ', fst.uid);
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            // console.log('res ::: ', res);
            this.boletos[i].boletos = res.boleto
          })
        });
        // console.log('this.boletos::: ', this.boletos);
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
          // console.log('   this.blt ::: ', fst.uid);
          this.boletosService.cargarBoletoByFiesta(fst.uid).subscribe(res => {
            // console.log('res ::: ', res);
            this.boletos[i].boletos = res.boleto
          })
        });
        // console.log('this.boletos::: ', this.boletos);
      })
    }

    this.loading = false



    /* if (this.rol === this.URS) {
      this.fiestasService.cargarFiestasByanfitrion(this.uid).subscribe((resp) => {
        this.fiestasTemp = resp.fiestas
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
        // console.log('this.fiestas', this.fiestas)
        // this.fiestas.forEach((fiesta: any) => {
        //   this.getBoleto(fiesta.uid)
        //   this.getSalon(fiesta.salon._id)
        //   setTimeout(() => {
        //     this.loading = false
        //   }, 800);
        // });
      })
    }
    else if (this.rol === this.SLN || this.rol === this.ANF) {
      this.usuario.salon.forEach(salon => {
        // console.log('this.usuario.salon::: ', this.usuario.salon);
        this.fiestasService.cargarFiestasBySalon(salon).subscribe((resp) => {
          // console.log('resp::: ', resp);
          if (resp.fiestas.length == 0) {
            this.loading = false
            return
          }
          this.fiestasTemp = resp.fiestas

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


          this.fiestas.forEach((fiesta: any) => {
            this.getBoleto(fiesta.uid)
            // console.log(this.boletos);
            
            this.getSalon(fiesta.salon._id)
            setTimeout(() => {

              this.loading = false
            }, 1500);
          });
        })
      });
    }
    else if (this.rol === this.ADM) {

      this.fiestasService.cargarFiestasAll().subscribe((resp) => {
        this.fiestasTemp = resp.fiestas
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
        this.fiestas.forEach((fiesta: any) => {
          // console.log('fiesta', fiesta)
          this.getBoleto(fiesta.uid)
          // this.getSalon(fiesta.salon)
          setTimeout(() => {
            // console.log(this.boletos)
            this.loading = false
          }, 1500);
        });
      })
    } */

  }
  getBoletoByFiesta(fiesta) {


  }

  getBoleto(id: string) {
    this.boletosService.cargarBoletoByFiesta(id).subscribe((resp) => {
      console.log('resp', resp)


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
    // console.log('type::: ', type);
    //console.log('invitados', invitados)

    var total = 0

    switch (type) {
      case 'ocupados':
        invitados.forEach(invitado => {
          // console.log('invitado::: ', invitado);
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



    /*  routerLink = "/core/agregar-invitado/true/6500ba909faa6731cb9f6b48" */
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
          //message
        },
        (err) => {

          //message

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



      let fiesta = this.fiestas.filter(fst => {
        return fst.uid == boleto.fiesta
      })




      let push = {
        "notification": {
          "title": "Recuerda que mi fiesta es el  " + this.functionsService.datePush(fiesta[0].fecha),
          "body": fiesta[0].nombre,
          "vibrate": [
            100,
            50,
            100
          ],
          "icon": "https://tickets.cochisweb.com/assets/images/qr.jpeg",
          "image": "https://tickets.cochisweb.com/api/upload/invitaciones/" + fiesta[0].img,

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
      console.log('push::: ', push);
      this.tokenPushService.sendTokenPushsByBoleto(boleto.uid, push).subscribe(resp => {
        console.log('resp::: ', resp);
        this.functionsService.alert("Notificaciones enviadas", "Recuerda pedir a tus invitados que activen las notificaciones en su invitación", "success")
      },
        (err) => {
          console.log('err::: ', err);

        })
    });





  }
}
