import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit, AfterViewInit {
  scannerActive = false
  loading = false
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  CHK = environment.chk_role
  idx: number = undefined
  boleto: Boleto
  boletosFind: any = []
  fiesta: Fiesta
  fiestas: Fiesta[]
  editBoleto = false
  invitado: any
  example = false
  today = this.functionsService.getToday()
  role = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  public form!: FormGroup
  public formInit!: FormGroup
  checking: boolean = false
  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private boletosService: BoletosService,
    private fiestasService: FiestasService,
    private fb: FormBuilder,
    private title: Title,
    private meta: Meta,
    private titleService: Title
  ) {
    this.formInit = this.fb.group({
      tipo: ['', [Validators.required]],
      fiesta: ['', [Validators.required]],
      nombreGrupo: ['', [Validators.required]],
      mesa: ['', [Validators.required]],
      boleto: ['', [Validators.required]],
    })
  }
  ngOnInit(): void {
    const titulo = 'My Ticket Party |  Check In ';
    const descripcion = 'El "check in" de eventos  permite a los organizadores y participantes gestionar la entrada a un evento de manera eficiente';
    this.functionsService.removeTags()
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/check-in' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: 'core/check-in' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }
  ngAfterViewInit() {
    this.getUser(this.role)
    this.createForm()
    this.getFiestas()
  }
  createForm() {
    this.form = this.fb.group({
      cantidad: ['', [Validators.required]],
    })

  }
  getUser(role) {
    if (role == this.SLN) {
      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
        if (!resp.usuario.salon || resp.usuario.salon == undefined || resp.usuario.salon == null) {
          this.functionsService.navigateTo('core/salones/registrar-salon')
        }
      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Home')
        })
    }
  }

  getFiestas() {

    if (this.role == this.SLN) {

      this.fiestasService.cargarFiestasByEmail(this.uid).subscribe(resp => {

        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestas = this.fiestas.filter(res => {

          return res.example == this.example
        })

      })
    } else if (this.role == this.ANF) {
      this.fiestasService.cargarFiestasByanfitrion(this.uid).subscribe(resp => {

        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestas = this.fiestas.filter(res => {

          return res.example == this.example
        })
      })
    } else if (this.role == this.ADM) {
      this.fiestasService.cargarFiestasAll().subscribe(resp => {

        this.fiestas = this.functionsService.getActives(resp.fiestas)
        this.fiestas = this.fiestas.filter(res => {

          return res.example == this.example
        })
      })
    } else if (this.role == this.CHK) {



      this.usuariosService.cargarUsuarioById(this.uid).subscribe((res: any) => {

        this.fiestasService.cargarFiestasBySalon(res.usuario.salon[0]._id).subscribe(resp => {


          this.fiestas = this.functionsService.getActives(resp.fiestas)



          this.fiestas = this.fiestas.filter(res => {

            return res.example == this.example
          })
        })
      })
    }
  }
  scan() {
    this.scannerActive = true

    setTimeout(() => {
      this.scannerActive = false

    }, 20000);
  }
  stop() {

    this.scannerActive = false
  }
  showQr(qr: any) {
    if (qr.ok) {
      this.stop()
      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
        let slns = resp.usuario.salon.filter((salon: any) => {
          if (salon._id == qr.data.salon) {
            return salon
          }
        })
        if (slns.length == 0 && this.role !== this.ADM) {
          this.functionsService.alert('Boletos', 'Ese boleto no existe en este salon', 'info')
          this.editBoleto = false
          return
        } else {
          this.boletosService.cargarBoletoById(qr.data.uid).subscribe((res: any) => {
            this.idx = undefined
            this.boleto = res.boleto

            this.fiestasService.cargarFiestaById(this.boleto.fiesta).subscribe((resp) => {

              this.fiesta = resp.fiesta

              this.checking = this.fiesta.checking
              if (this.fiesta.checking) {
                this.editBoleto = true
              } else {

                Swal.fire({
                  title: "¿Cuantas personas ingresan?",
                  input: "number",
                  inputAttributes: {
                    min: "0"
                  },
                  showCancelButton: true,
                  confirmButtonText: "Ingresar",
                  showLoaderOnConfirm: true,
                  confirmButtonColor: "#13547a",
                  preConfirm: async (cantidad) => {
                    try {

                      this.boleto.confirmado = true
                      this.boleto.ocupados = Number(this.boleto.ocupados) + Number(cantidad)
                      this.boleto.fechaConfirmacion = this.today
                      this.boletosService.actualizarBoleto(this.boleto).subscribe((resp) => {
                        if (this.fiesta.mesaOk) {
                          this.functionsService.alert('Bienvenidos', 'Su lugar se encuentra en la mesa ' + this.boleto.mesa, 'success')

                        } else {
                          this.functionsService.alert('Bienvenidos', 'Los estábamos esperando ', 'success')
                        }
                      })
                    } catch (error) {
                      console.error('error::: ', error);
                      Swal.showValidationMessage(`
        Request failed: ${error}
      `);
                    }
                  },
                  allowOutsideClick: () => !Swal.isLoading()
                })


              }

            })




          })
        }
      })
    }
  }
  onSubmit() {
    this.loading = true
    if (this.boleto.ocupados === 0) {
      this.boleto.ocupados = this.form.value.cantidad
    } else {
      this.boleto.ocupados += this.form.value.cantidad
    }
    if (this.boleto.ocupados > this.boleto.cantidadInvitados) {
      this.functionsService.alert('Boletos', 'No tiene disponibles esa cantidad de boletos', 'info')
    }
    this.boleto.confirmado = true
    this.boleto.fechaConfirmacion = this.today
    this.boletosService.actualizarBoleto(this.boleto).subscribe(resp => {
      this.functionsService.alert('Bienvenidos', 'Los estábamos esperando ', 'success')
      this.form.reset()
      this.formInit.reset()
      this.functionsService.alertUpdate('Check in')
      this.editBoleto = false
      this.loading = false
    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Check in')
      })
  }
  findInvite() {
    this.editBoleto = true
  }

  setBoleto(boleto) {
    this.idx = boleto

    this.boletosService.cargarBoletoById(this.idx).subscribe((resp) => {

      this.boleto = resp.boleto

    })

  }
  setFiesta(fiesta) {

    this.editBoleto = false
    let res = this.fiestas.filter(res => {
      return res.uid == fiesta
    })

    this.fiesta = res[0]


    this.checking = this.fiesta.checking
    this.formInit.patchValue({
      tipo: '',
      boleto: ''
    })

  }
  filterBy(form: any) {

    this.boletosService.cargarBoletoByFiesta(form.fiesta).subscribe(resp => {

      this.boletosFind = this.functionsService.getActives(resp.boleto)
      this.boletosFind.map(blt => {
        return blt.nombreGrupo = blt.nombreGrupo.toUpperCase()
      })

      this.boletosFind.sort(function (a, b) {
        return (a.nombreGrupo.toLowerCase().localeCompare(b.nombreGrupo.toLowerCase()))
      });

    })

  }

  back() {
    this.form.reset()
    this.formInit.patchValue({ fiesta: '' })
    this.editBoleto = false
  }
  viewEjemplos(example) {

    this.example = example
    this.getFiestas()
  }
}
