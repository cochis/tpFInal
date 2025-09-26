import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Salon } from 'src/app/core/models/salon.model';

import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';

import { CargarBoleto, CargarFiesta, CargarFiestas, CargarGrupos, CargarInvitacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Grupo } from 'src/app/core/models/grupo.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { GruposService } from 'src/app/core/services/grupo.service';
import { SafeUrl } from '@angular/platform-browser';
import { FileService } from 'src/app/core/services/file.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BehaviorSubject, Observable, Subscription, interval, switchMap } from 'rxjs';
import { EmailsService } from 'src/app/core/services/email.service';
import * as XLSX from 'xlsx'
import { SharedsService } from 'src/app/core/services/shared.service';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';
import { Invitacion } from 'src/app/core/models/invitacion.model';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-editar-boleto',
  templateUrl: './editar-boleto.component.html',
  styleUrls: ['./editar-boleto.component.scss']
})
export class EditarBoletoComponent implements OnInit, OnDestroy {
  convertedJson = []
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  public imagenSubir!: File
  public imgTemp: any = undefined
  idBoleto = ''
  email = this.functionsService.getLocal('email')
  role = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  today: Number = this.functionsService.getToday()
  fiestas!: Fiesta[]
  submited: boolean = false
  grupos!: Grupo[]
  salon!: Salon
  boleto!: any
  boletoTemp!: any
  boletoNuevo!: any
  formSubmitted: boolean = false
  cargando: boolean = false
  invitacion!: Invitacion
  numeroInvitados: number = 0
  sumaInvitados: number = 0
  fiesta!: any
  id!: string
  edit!: string
  url = environment.base_url
  urlT = environment.text_url
  loading = false
  retornaBoletosSubs: Subscription
  msnOk: boolean = false
  btnDisabled = false
  tiempo = new BehaviorSubject<number>(5000);
  contador = 0;
  obs1: Subscription;
  mensajeOk = false
  recordatorioOk = false
  mensajeTemp = 'Hola *@@invitado@@*  está invitado a *@@nombre_evento@@*  *@@liga_evento@@* con *@@cantidadInvitados@@*  Boletos  FAVOR DE CONFIRMAR ASISTENCIA'
  mensaje = ''
  recordatorioTemp = 'Hola *@@invitado@@* recuerda que mi evento es *@@fecha_evento@@* *@@nombre_evento@@*'
  recordatorio = ''
  public qrCodeDownloadLink: SafeUrl = "";

  public form!: FormGroup
  sharedTemp!: any
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private functionsService: FunctionsService,
    private fb: FormBuilder,
    private boletosService: BoletosService,
    private fiestasService: FiestasService,
    private gruposService: GruposService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private emailsService: EmailsService,
    private sharedService: SharedsService,
    private invitacionService: InvitacionsService,

  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 3500);
  }


  changeTime(value) {
    const nuevoTiempo = parseInt(value, 10);
    this.tiempo.next(nuevoTiempo);

    this.contador = 0; // Reiniciar contador si deseas


  }
  ngOnInit() {



    this.obs1 = this.tiempo
      .pipe(
        switchMap(ms => interval(ms))
      )
      .subscribe((value: any) => {


        let restore = false

        this.boletosService.cargarBoletoByFiesta(this.id).subscribe((resp: CargarBoleto) => {
          this.boletoTemp = this.functionsService.getActives(resp.boleto)


          //this.exportToExcel(this.boletoTemp)
          this.boletoTemp.forEach(blt => {
            if (!blt.shared) {

              let data = {
                type: 'invitacion',
                fiesta: this.fiesta.uid,
                boleto: blt.uid,
                data: {
                  fiesta: this.fiesta,
                  boleto: blt,

                },
                compartidas: 1,
                vistas: 0,
                usuarioCreated: this.uid,
                activated: true,
                dateCreated: this.today,
                lastEdited: this.today,
              }
              this.sharedService.crearShared(data).subscribe((res: any) => {

                const sharedId = res.shared.uid
                const actBol = {
                  ...blt,
                  shared: res.shared.uid
                }
                this.boletosService.actualizarBoleto(actBol).subscribe((res: any) => {

                  data.boleto = res.boletoActualizado


                })





              })






            }
          });


          this.getFiesta(this.fiesta.uid)
        },
          (error: any) => {
            this.functionsService.alertError(error, 'Boletos')
          })
      });
  }
  ngOnDestroy(): void {
    if (this.obs1) this.obs1.unsubscribe();
  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  getFiesta(id: string) {
    this.fiestasService.cargarFiestaById(id).subscribe((resp: any) => {
      this.fiesta = resp.fiesta

      this.mensaje = (this.fiesta.mensaje == '' || undefined) ? this.mensajeTemp : resp.fiesta.mensaje
      this.recordatorio = resp.fiesta.recordatorio


    })
  }
  getId(id: string) {
    this.fiestasService.cargarFiestaById(id).subscribe((resp: any) => {
      this.fiesta = resp.fiesta


      this.mensaje = (this.fiesta.mensaje == '' || undefined) ? this.mensajeTemp : resp.fiesta.mensaje
      this.recordatorio = resp.fiesta.recordatorio
      this.numeroInvitados = this.fiesta.cantidad
      this.setForm(this.fiesta)
    })
  }
  createForm() {
    this.form = this.fb.group({
      fiesta: ['', [Validators.required]],
      llena: [false],
      invitados: this.fb.array([]),
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  get errorControl() {
    return this.form.controls;
  }
  setForm(boleto: Fiesta) {
    setTimeout(() => {
      this.form = this.fb.group({
        fiesta: [boleto.nombre, [Validators.required]],
        llena: [false],
        invitados: this.fb.array([]),
        activated: [boleto.activated],
        dateCreated: [boleto.dateCreated],
        lastEdited: [this.today],
      })
      this.boletosService.cargarBoletoByFiesta(this.id).subscribe((resp: CargarBoleto) => {
        this.boleto = resp.boleto

        /* this.boleto = this.functionsService.getActivos(resp.boleto) */

        this.boleto.forEach((invitado: any) => {
          this.invitados.push(this.setInvitado(invitado))
        });

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
        })
    }, 500);
  }
  verMensaje() {
    this.mensajeOk = !this.mensajeOk
  }

  guardarMensaje(mensaje) {
    this.loading = true
    this.fiesta.mensaje = mensaje
    this.fiestasService.actualizarFiesta(this.fiesta).subscribe((res: any) => {
      this.mensaje = res.fiestaActualizado.mensaje
      this.mensajeOk = !this.mensajeOk
      this.loading = false
      this.functionsService.alertUpdate('Mensaje WhatsApp')
    })

  }
  verRecordatorio() {
    this.recordatorioOk = !this.recordatorioOk
  }
  guardarRecordatorio(recordatorio) {
    this.loading = true
    this.fiesta.recordatorio = recordatorio
    this.fiestasService.actualizarFiesta(this.fiesta).subscribe((res: any) => {
      this.recordatorio = res.fiestaActualizado.recordatorio
      this.recordatorioOk = !this.recordatorioOk
      this.loading = false
      this.functionsService.alertUpdate('Recordatorio de fiesta')
    })

  }
  getCatalogos() {
    this.loading = true
    this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
      this.fiestas = this.functionsService.getActives(resp.fiestas)

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
    this.gruposService.cargarGruposAll().subscribe((resp: CargarGrupos) => {
      this.grupos = this.functionsService.getActives(resp.grupos)

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
    this.invitacionService.cargarInvitacionByFiesta(this.id).subscribe((resp: CargarInvitacion) => {
      this.invitacion = resp.invitacion


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
  }
  get invitados(): FormArray {
    return this.form.get('invitados') as FormArray
  }
  newInvitado(): FormGroup {
    return this.fb.group({
      uid: [''],
      fiesta: [this.fiesta.uid, [Validators.required]],
      grupo: ['', [Validators.required]],
      salon: [this.fiesta.salon, [Validators.required]],
      nombreGrupo: ['', [Validators.required]],
      whatsapp: ['', [Validators.minLength(10)]],
      email: ['', [Validators.email]],
      cantidadInvitados: [0],
      requeridos: [0],
      mesa: [''],
      ocupados: [0],
      confirmado: [false],
      invitacionEnviada: [false],
      fechaConfirmacion: [null],
      activated: [true]
    })
  }
  setInvitado(invitado: any): FormGroup {


    return this.fb.group({
      uid: [(invitado.uid !== '') ? invitado.uid : '', [Validators.required]],
      fiesta: [(invitado.fiesta !== '') ? invitado.fiesta : '', [Validators.required]],
      grupo: [invitado.grupo, [Validators.required]],
      salon: [(invitado.salon !== '') ? invitado.salon : '', [Validators.required]],
      nombreGrupo: [(invitado.nombreGrupo !== '') ? invitado.nombreGrupo : '', [Validators.required]],
      whatsapp: [(invitado.whatsapp !== undefined) ? invitado.whatsapp : '', [Validators.minLength(10)]],
      email: [(invitado.email !== undefined) ? invitado.email : '', [Validators.email]],
      cantidadInvitados: [(invitado.cantidadInvitados !== undefined) ? invitado.cantidadInvitados : 0],
      requeridos: [(invitado.requeridos !== undefined) ? invitado.requeridos : 0],
      mesa: [(invitado.mesa !== undefined) ? invitado.mesa : ''],
      ocupados: [(invitado.ocupados !== undefined) ? invitado.ocupados : 0],
      confirmado: [invitado.confirmado],
      invitacionEnviada: [invitado.invitacionEnviada],
      fechaConfirmacion: [invitado.fechaConfirmacion],
      activated: [invitado.activated]
    })
  }
  getDisabled() {

    if (this.numeroInvitados < this.total && this.fiesta.checking) {
      return true
    } else {
      return false
    }
  }
  getQr(invitado) {
    if ((invitado.value !== undefined) && typeof (invitado.value.salon) === 'object') {
      ;
      let qr = {
        uid: '',

        fiesta: this.fiesta.uid,
        grupo: '',

        salon: invitado.value.salon._id,

      }
      return JSON.stringify(qr)
    } else {


      let invi = {

        uid: invitado.value.uid,
        fiesta: invitado.value.fiesta,
        grupo: invitado.value.grupo,
        salon: invitado.value.salon
      }

      return JSON.stringify(invi)
    }
  }
  getQrInvitacion(invitado) {
    if ((invitado.value !== undefined) && typeof (invitado.value.salon) === 'object') {

      let qr = {
        uid: '',

        fiesta: this.fiesta.uid,
        grupo: '',

        salon: invitado.value.salon._id,

      }
      return JSON.stringify(qr)
    } else {
      if (this.boletoTemp) {

        let blt = this.boletoTemp.filter((blt: any) => { return blt.uid === invitado.value.uid })
        let url = `${this.urlT}shared?evt=${blt[0].shared}`
        return url
      } else {
        return ''
      }
    }
  }
  selectNumero(event: any) {
    this.numeroInvitados = this.functionsService.getValueCatalog(event, 'cantidad', this.fiestas)
  }
  cuentaInvitados(event: any) {
    this.numeroInvitados = this.numeroInvitados - Number(event.target.value)
  }
  addInvitados() {
    this.invitados.push(this.newInvitado())
    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));
  }
  removeInvitados(i: number) {
    this.boletosService.isActivedBoleto(this.form.value.invitados[i]).subscribe((resp: any) => {
      this.setForm(this.fiesta)
      this.functionsService.alertUpdate('Boletos')
    })
  }
  onSubmit() {
    this.ngOnDestroy()

    this.submited = true

    this.loading = true
    this.form.value.fiesta = this.fiesta.uid
    this.form.value.invitados.forEach((boleto, index) => {
      if (boleto.uid == '') {
        this.boletosService.crearBoleto(boleto).subscribe((resp: any) => {
          if ((this.form.value.invitados.length - 1) === index) {
            this.functionsService.alertUpdate('Boletos')
            if (this.role == this.URS) {
              this.functionsService.navigateTo('core/mis-fiestas')
            } else {
              this.functionsService.navigateTo('core/boletos/vista-boletos')
            }
            this.ngOnDestroy()
          }
        },
          (error) => {
            this.loading = false
            console.error('error::: ', error);
            this.functionsService.alertError(error, 'Boletos')
          })
      } else {
        this.boletosService.actualizarBoleto(boleto).subscribe((resp: any) => {
          if ((this.form.value.invitados.length - 1) === index) {
            this.functionsService.alertUpdate('Boletos')
            if (this.role == this.URS) {
              this.functionsService.navigateTo('core/mis-fiestas')
            } else {
              this.functionsService.navigateTo('core/boletos/vista-boletos')
            }
            this.ngOnDestroy()
          }
        },
          (error) => {
            this.loading = false
            console.error('error::: ', error);
            this.functionsService.alertError(error, 'Boletos')
          })
      }
    });
    this.loading = false
    return
  }
  get total() {
    var total = 0
    this.form.value.invitados.forEach((c: any) => {
      if (c.activated) {
        total = total + Number(c.cantidadInvitados)
      }
    });
    return total
  }
  getFiestas() {
    this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
      this.fiestas = this.functionsService.getActives(resp.fiestas)
    }, (error) => {
      console.error('error::: ', error);
      this.functionsService.alertError(error, 'Boletos')
    })
  }
  back() {
    this.ngOnDestroy()
    if (this.role == this.URS) {
      this.functionsService.navigateTo('core/mis-fiestas')
    } else {
      this.functionsService.navigateTo('core/boletos/vista-boletos')
    }
  }
  backURS() {
    this.functionsService.navigateTo('core/mis-fiestas')
  }
  getCatalog(tipo: string, id: string) {
    switch (tipo) {
      case 'fiesta':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.fiestas)
        break;
    }
  }
  cambiarImagen(file: any, fiesta: any) {
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
        },
        (err) => {
          this.functionsService.alertError(err, "Subir imagen")
        },
      )
  }
  enviarInvitacion(i) {
    let idBoleto = ''
    var data = null
    let type = 'invitacion'
    if (this.numeroInvitados < this.total && this.fiesta.checking) {
      this.functionsService.alert('Boletos', 'Se ha excedido de la cantidad de boletos permitidos', 'error')
      return
    }
    this.form.value.fiesta = this.fiesta.uid
    if (this.role === this.URS) {
      this.form.value.fiesta = this.boleto.fiesta
    }
    if (this.form.value.invitados[i].uid) {
      this.actualizarBoleto(this.form.value.invitados[i])
    } else {
      this.saveBoleto(this.form.value.invitados[i])
    }
    setTimeout(() => {
      window.scrollTo(0, 800);
      let optsSwal = {
        title: "¿Deseas mandar la invitación?",
        showCloseButton: true,
        showDenyButton: true,
        confirmButtonText: "WhatsApp",
        denyButtonText: 'Correo Electronico',
        confirmButtonColor: "#13547a",
        denyButtonColor: '#80d0c7',
      }
      Swal.fire(optsSwal).then((result) => {
        this.loading = true
        this.sharedService.cargarSharedsFiestaBoleto(this.fiesta.uid, this.idBoleto).subscribe((res: any) => {

          this.sharedTemp = res.shareds

          if (res.shareds.length == 0) {
            var boletoShared = null
            this.boletosService.cargarBoletoById(this.idBoleto).subscribe((resp: CargarBoleto) => {
              boletoShared = resp.boleto
              data = {
                type: 'invitacion',
                fiesta: this.fiesta.uid,
                boleto: this.idBoleto,
                data: {
                  fiesta: this.fiesta,
                  boleto: boletoShared,

                },
                compartidas: 1,
                vistas: 0,
                usuarioCreated: this.uid,
                activated: true,
                dateCreated: this.today,
                lastEdited: this.today,
              }
              this.sharedService.crearShared(data).subscribe((res: any) => {

                const sharedId = res.shared.uid
                const actBol = {
                  ...boletoShared,
                  shared: res.shared.uid
                }

                this.boletosService.actualizarBoleto(actBol).subscribe((res: any) => {

                  data.boleto = res.boletoActualizado

                  if (result.isConfirmed) {
                    var texto
                    let tel = this.form.value.invitados[i].whatsapp
                    let nGrupo = this.form.value.invitados[i].nombreGrupo
                    let cantP = Number(this.form.value.invitados[i].cantidadInvitados)
                    let cantT = (cantP == 1) ? 'esta' : 'están'
                    let textoP = (cantP == 1) ? 'invitado' : 'invitados'
                    let evento = this.fiesta.nombre
                    let boletoP = (cantP == 1) ? 'boleto' : 'boletos'
                    let bl = (cantP > 0) ? ` con  *${cantP}* ${boletoP} ` : ``
                    /* let ligaGaleria = `${this.urlT}core/galeria/fst${this.fiesta.invitacion}/blt/${this.idBoleto}` */
                    let ligaGaleria = `${this.urlT}shared?evt=${data.boleto.shared}`

                    if (this.fiesta.mensaje == '') {
                      this.fiesta.mensaje = this.mensajeTemp
                    }

                    this.fiesta.mensaje = this.fiesta.mensaje.replace('@@invitado@@', nGrupo.toLocaleUpperCase())
                    this.fiesta.mensaje = this.fiesta.mensaje.replace('@@cantidadInvitados@@', cantP)
                    this.fiesta.mensaje = this.fiesta.mensaje.replace('@@nombre_evento@@', evento)
                    this.fiesta.mensaje = this.fiesta.mensaje.replace('@@liga_galeria@@', ligaGaleria)
                    /*    this.fiesta.mensaje = this.fiesta.mensaje.replace('@@liga_evento@@', `${this.urlT}core/templates/${this.fiesta.invitacion}/${this.fiesta.uid}/${this.idBoleto}`) */

                    this.fiesta.mensaje = this.fiesta.mensaje.replace('@@liga_evento@@', `${this.urlT}shared?evt=${sharedId}`)

                    let url = `https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(this.fiesta.mensaje)}`
                    Swal.fire({ title: "Enviado por whatsapp!", text: "", icon: "success", confirmButtonColor: "#13547a" });



                    window.open(url, '_blank');


                    this.form.value.invitados[i].invitacionEnviada = true
                    this.boleto =
                    {
                      ...this.boleto,
                      ...this.form.value
                    }
                    this.boletosService.actualizarBoleto(this.form.value.invitados[i]).subscribe((resp: any) => {
                      this.loading = false
                      this.functionsService.alertUpdate('Boletos')
                    },
                      (error) => {
                        console.error('error::: ', error);
                        this.loading = false
                        this.functionsService.alertError(error, 'Boletos')
                      })

                  } else if (result.isDenied) {

                    var shT = this.sharedTemp.filter((sha: any) => {
                      return sha.boleto == this.boleto.uid
                    })
                    shT[0].enviadas = this.sharedTemp.enviadas + 1



                    let bol = {
                      ...this.form.value.invitados[i],
                      text_url: this.urlT
                    }
                    this.emailsService.sendMailByBoleto(bol).subscribe(resp => {
                      this.loading = false
                      this.sharedService.actualizarShared(shT[0]).subscribe((resShared: any) => {


                        Swal.fire({ title: "Enviado por Correo!", text: "", icon: "success", confirmButtonColor: "#13547a" });
                      })


                    },
                      (error) => {
                        console.error('error::: ', error);
                        this.loading = false
                        this.functionsService.alertError(error, 'Boletos')
                      })

                  } else {
                    this.loading = false
                  }
                })




              })
            });




          } else {


            var sharedT = res.shareds[0]
            if (result.isConfirmed) {
              var texto
              let tel = this.form.value.invitados[i].whatsapp
              let nGrupo = this.form.value.invitados[i].nombreGrupo
              let cantP = Number(this.form.value.invitados[i].cantidadInvitados)
              let cantT = (cantP == 1) ? 'esta' : 'están'
              let textoP = (cantP == 1) ? 'invitado' : 'invitados'
              let evento = this.fiesta.nombre
              let boletoP = (cantP == 1) ? 'boleto' : 'boletos'
              let bl = (cantP > 0) ? ` con  *${cantP}* ${boletoP} ` : ``
              let ligaGaleria = `${this.urlT}core/galeria/fst${this.fiesta.invitacion}/blt/${this.idBoleto}`
              /* let ligaGaleria = `${this.urlT}shared?evt=${res.shareds[0].uid}` */

              if (this.fiesta.mensaje == '') {
                this.fiesta.mensaje = this.mensajeTemp
              }

              this.fiesta.mensaje = this.fiesta.mensaje.replace('@@invitado@@', nGrupo.toLocaleUpperCase())
              this.fiesta.mensaje = this.fiesta.mensaje.replace('@@cantidadInvitados@@', cantP)
              this.fiesta.mensaje = this.fiesta.mensaje.replace('@@nombre_evento@@', evento)
              this.fiesta.mensaje = this.fiesta.mensaje.replace('@@liga_galeria@@', ligaGaleria)
              /* this.fiesta.mensaje = this.fiesta.mensaje.replace('@@liga_evento@@', `${this.urlT}core/templates/${this.fiesta.invitacion}/${this.fiesta.uid}/${this.idBoleto}`) */
              this.fiesta.mensaje = this.fiesta.mensaje.replace('@@liga_evento@@', `${this.urlT}shared?evt=${res.shareds[0].uid}`)


              let url = `https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(this.fiesta.mensaje)}`



              sharedT.compartidas = sharedT.compartidas + 1

              this.sharedService.actualizarShared(sharedT).subscribe((res: any) => {



                Swal.fire({ title: "Enviado por whatsapp!", text: "", icon: "success", confirmButtonColor: "#13547a" });
                window.open(url, '_blank');
              })



              this.form.value.invitados[i].invitacionEnviada = true
              this.boleto =
              {
                ...this.boleto,
                ...this.form.value
              }
              this.boletosService.actualizarBoleto(this.form.value.invitados[i]).subscribe((resp: any) => {
                this.loading = false
                this.functionsService.alertUpdate('Boletos')
              },
                (error) => {
                  console.error('error::: ', error);
                  this.loading = false
                  this.functionsService.alertError(error, 'Boletos')
                })

            } else if (result.isDenied) {
              let bol = {
                ...this.form.value.invitados[i],
                text_url: this.urlT
              }
              this.emailsService.sendMailByBoleto(bol).subscribe((resp: any) => {

                this.loading = false

                sharedT.compartidas = sharedT.compartidas + 1

                this.sharedService.actualizarShared(sharedT).subscribe((res: any) => {


                  Swal.fire({ title: "Enviado por Correo!", text: "", icon: "success", confirmButtonColor: "#13547a" });
                })



              },
                (error) => {
                  console.error('error::: ', error);
                  this.loading = false
                  this.functionsService.alertError(error, 'Boletos')
                })
            } else {
              this.loading = false
            }
            this.loading = false
            return
          }

        })


      });

      this.loading = false
    }, 500);
  }
  showConfirmados(content) {
    this.modalService.open(content);
  }
  saveBoleto(boleto) {

    this.boletosService.crearBoleto(boleto).subscribe((resp: any) => {
      this.idBoleto = resp.boleto.uid
      this.functionsService.alertUpdate('Boletos')
      this.setForm(this.fiesta)
    },
      (error) => {
        console.error('error::: ', error);
        this.loading = false
        this.functionsService.alertError(error, 'Boletos')
      })

  }
  actualizarBoleto(boleto) {

    this.boletosService.actualizarBoleto(boleto).subscribe((resp: any) => {
      this.idBoleto = resp.boletoActualizado.uid
      this.functionsService.alertUpdate('Boletos')
    },
      (error) => {
        console.error('error::: ', error);
        this.loading = false
        this.functionsService.alertError(error, 'Boletos')
      })
  }
  copiarLink(fiesta, boleto) {


    this.sharedService.cargarSharedsFiestaBoleto(this.fiesta.uid, boleto).subscribe((res: any) => {

      this.boletosService.cargarBoletoById(boleto).subscribe((resb: any) => {


        var url = ''
        url = this.urlT + 'shared/?evt=' + resb.boleto.shared
        var aux = document.createElement("input");
        aux.setAttribute("value", url);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        this.functionsService.alert('Liga de fiesta', 'Copiada satisfactoriamente a portapapeles para compartir', 'success')
      })

    })

  }
  upload(event) {
    const selectedFile = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(selectedFile)
    fileReader.onload = (event) => {
      let binaryData = event.target.result
      let workbook = XLSX.read(binaryData, { type: 'binary' })
      workbook.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        this.convertedJson.push(data)
      })
      this.convertedJson.forEach((element, i) => {
        element.forEach((ele, j) => {
          if (typeof (this.convertedJson[i][j].options) == 'string' && this.convertedJson[i][j].options) {
            this.convertedJson[i][j].options = JSON.parse(this.convertedJson[i][j].options)
          }
        });
      });
      this.boletosService.deleteBoletos().subscribe(resp => {


        this.convertedJson[0].forEach(bol => {
          this.loading = false
          let gpo = this.grupos.filter(f => f.nombre.toLowerCase().trim() === bol.Grupo.toLowerCase().trim())
          let boleto = {
            activated: true,
            cantidadInvitados: bol.Cantidad,
            confirmado: false,
            email: bol.Correo,
            fechaConfirmacion: null,
            fiesta: this.id,
            grupo: gpo[0].uid,
            nombreGrupo: bol.Nombre,
            invitacionEnviada: false,
            mesa: bol.Mesa,
            ocupados: 0,
            salon: this.fiesta.salon._id,
            whatsapp: bol.Telefono,
            vista: false
          }
          this.saveBoleto(boleto)
          this.loading = false
        });
        this.loading = false
        setTimeout(() => {

          window.location.reload()
        }, 1500);
      })
    }
  }
  async uploadBoletos(ev) {
    this.loading = true
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = async (event) => {

      const data = reader.result;

      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});



      jsonData.Invitados.forEach(element => {


      });
      let totalI = await this.conteoInvitadosFile(jsonData.Invitados)


      if (this.numeroInvitados > 0) {

        if ((totalI + this.total) > this.numeroInvitados) {
          this.functionsService.alert('Boletos', 'La cantidad de invitados es mayor a la capasidad disponible', 'error')


          setTimeout(() => {

            this.loading = false
          }, 1500);
          return
        }

      }

      let invi = await this.validarInvitadosFile(jsonData.Invitados)



      let final = await this.crearInvitacionesFile(invi)


      setTimeout(() => {
        this.getId(this.id)


      }, 4000);
      setTimeout(() => {


        this.loading = false
      }, 7000);
    }
    reader.readAsBinaryString(file);
  }


  async conteoInvitadosFile(data) {
    let totalFile = 0
    data.forEach(invi => {

      totalFile = totalFile + invi.Cantidad



    });

    return await totalFile
  }
  async validarInvitadosFile(data) {


    var invitados = []
    var invitado = null

    data.forEach(async (invi, i) => {



      this.grupos.forEach(async gpo => {

        if ((gpo.nombre.toLowerCase().trim()) == (invi.Grupo.toLowerCase().trim())) {


          invitado = {
            activated: true,
            cantidadInvitados: invi.Cantidad,
            confirmado: false,
            email: invi['Correo Electronico'],
            fechaConfirmacion: null,
            fiesta: this.id,
            grupo: gpo.uid,
            nombreGrupo: invi['Nombre de grupo'],
            invitacionEnviada: false,
            mesa: invi.Mesa,
            ocupados: 0,
            salon: this.fiesta.salon._id,
            whatsapp: invi.Telefono,
            vista: false
          }


          invitados.push(invitado)
        }
      });
    });
    return await invitados
  }
  async crearInvitacionesFile(data) {
    var invitados = []
    var invitado = null
    return await data.forEach(async invi => {
      this.boletosService.crearBoleto(invi).subscribe(async res => {
        await invitados.push(res)
      })
    });
  }
  exportToExcel(): void {
    // 1. Convertir JSON a hoja de cálculo
    let blts = []
    console.log(this.fiesta);

    this.boletoTemp.forEach(b => {

      if (b.activated) {
        let blt = {
          "Asistirá": (b.confirmado == null || b.confirmado) ? "❌" : "✅",
          "Invitado": b.nombreGrupo.toUpperCase(),
          "Cantidad": (this.fiesta.checking) ? "N/A" : b.cantidadInvitados,
          "Boletos Requeridos": b.requeridos,
          "Mesa": b.mesa,
          "WhatsApp": b.whatsapp,
          "Email": b.email,
          "Invitacion Enviada": (b.invitacionEnviada == null || !b.invitacionEnviada) ? '❌' : '✅',
          "Invitacion Vista": (b.vista == null || !b.vista) ? '❌' : '✅',
          "Invitacion Confirmada": (b.confirmado == null || !b.confirmado) ? '❌' : '✅',

        }
        blts.push(blt)
      }
    });


    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(blts);

    // 2. Crear un libro de Excel y agregar la hoja
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Invitados': worksheet },
      SheetNames: ['Invitados']
    };

    // 3. Generar un buffer Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    let fiesta = this.fiesta.nombre + this.functionsService.numberDateTimeLocal(this.today) + '.xlsx'
    // 4. Guardar el archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, fiesta);
  }
}
