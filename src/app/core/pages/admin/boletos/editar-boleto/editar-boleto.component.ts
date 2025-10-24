import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Salon } from 'src/app/core/models/salon.model';

import { Boleto } from 'src/app/core/models/boleto.model'; // No se usa directamente pero se mantiene por contexto
import { Fiesta } from 'src/app/core/models/fiesta.model';

import { CargarBoleto, CargarFiestas, CargarGrupos, CargarInvitacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

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
import { BehaviorSubject, Subscription, interval, switchMap } from 'rxjs';
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
  // Configuración de Roles y Entorno
  ADM = environment.admin_role // Rol de administrador
  SLN = environment.salon_role // Rol de salón (no usado en el código visible)
  URS = environment.user_role // Rol de usuario
  url = environment.base_url // URL base del entorno
  urlT = environment.text_url // URL de texto/invitaciones

  // Propiedades de Subida de Imagen
  public imagenSubir!: File // Archivo de imagen a subir
  public imgTemp: any = undefined // URL temporal de la imagen

  // Datos de Sesión y Tiempo
  idBoleto = '' // UID del boleto actual o recién creado
  email = this.functionsService.getLocal('email') // Correo del usuario
  role = this.functionsService.getLocal('role') // Rol del usuario
  uid = this.functionsService.getLocal('uid') // UID del usuario
  today: Number = this.functionsService.getToday() // Fecha actual en formato numérico

  // Listas de Datos
  fiestas!: Fiesta[] // Lista de todas las fiestas (para catálogos)
  grupos!: Grupo[] // Lista de grupos/categorías de invitados
  salon!: Salon // Objeto Salón (no usado directamente)
  invitacion!: Invitacion // Objeto Invitación

  // Datos de la Fiesta y Boletos
  boleto!: any // Boletos cargados para la fiesta (para el formArray)
  boletoTemp!: any // Boletos activos de la fiesta (para la subscripción de actualización)
  fiesta!: any // Objeto Fiesta cargado
  numeroInvitados: number = 0 // Cantidad máxima de invitados de la fiesta
  sumaInvitados: number = 0 // Variable no usada visiblemente

  // Propiedades de Ruta
  id!: string // ID de la fiesta obtenido de la ruta
  edit!: string // Parámetro 'edit' de la ruta (no usado visiblemente)

  // Control de UI
  submited: boolean = false // Estado de subida del formulario (general)
  formSubmitted: boolean = false // Estado de subida del formulario (alternativa, no usada visiblemente)
  cargando: boolean = false // Estado de carga (alternativa, no usada visiblemente)
  loading = false // Estado de carga principal
  msnOk: boolean = false // Estado de mensaje ok (no usado visiblemente)
  btnDisabled = false // Estado de botón deshabilitado (no usado visiblemente)
  mensajeOk = false // Control de visibilidad del editor de mensaje de WhatsApp
  recordatorioOk = false // Control de visibilidad del editor de recordatorio

  // Propiedades de QR
  public qrCodeDownloadLink: SafeUrl = ""; // URL segura para la descarga del QR

  // Propiedades de Mensajería
  mensajeTemp = 'Hola *@@invitado@@* está invitado a *@@nombre_evento@@* *@@liga_evento@@* con *@@cantidadInvitados@@* Boletos  FAVOR DE CONFIRMAR ASISTENCIA' // Mensaje de WhatsApp por defecto
  mensaje = '' // Mensaje de WhatsApp actual de la fiesta
  recordatorioTemp = 'Hola *@@invitado@@* recuerda que mi evento es *@@fecha_evento@@* *@@nombre_evento@@*' // Recordatorio por defecto
  recordatorio = '' // Recordatorio actual de la fiesta

  // Formulario Reactivo
  public form!: FormGroup // Formulario principal para la fiesta y los boletos

  // Propiedades de Archivos Excel
  convertedJson = [] // JSON temporal para la importación de Excel

  // Propiedades de Shared (URL/Vistas)
  sharedTemp!: any // Objeto Shared temporal

  // Propiedades de Subscripción y Observables para el Polling de Boletos
  tiempo = new BehaviorSubject<number>(5000); // Observable para el intervalo de polling (inicializa a 5000ms)
  contador = 0; // Contador no usado visiblemente
  obs1!: Subscription; // Subscripción al Observable de polling
  retornaBoletosSubs!: Subscription // Subscripción no usada visiblemente

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
    this.id = this.route.snapshot.params['id'] // Obtiene el ID de la fiesta
    this.edit = this.route.snapshot.params['edit'] // Obtiene el parámetro 'edit'
    this.loading = true
    this.getId(this.id) // Carga los datos iniciales de la fiesta
    this.getCatalogos() // Carga catálogos (fiestas, grupos, invitación)
    this.createForm() // Inicializa el formulario reactivo
    setTimeout(() => {
      this.loading = false
    }, 3500);
  }

  /**
   * Cambia el tiempo de intervalo del BehaviorSubject 'tiempo' para el polling.
   * @param value Nuevo tiempo en milisegundos (string que se convierte a number).
   */
  changeTime(value: any) {
    const nuevoTiempo = parseInt(value, 10);
    this.tiempo.next(nuevoTiempo);
    this.contador = 0; // Reinicia el contador
  }

  /**
   * Hook de inicialización del componente.
   * Inicia el polling para la actualización de boletos y creación de objetos 'shared'.
   */
  ngOnInit() {
    // Inicia la subscripción de polling: emite el valor de 'tiempo' y luego usa 'interval' con ese valor.
    this.obs1 = this.tiempo
      .pipe(
        switchMap(ms => interval(ms))
      )
      .subscribe(() => {
        this.boletosService.cargarBoletoByFiesta(this.id).subscribe((resp: CargarBoleto) => {
          this.boletoTemp = this.functionsService.getActives(resp.boleto) // Obtiene boletos activos

          // Itera sobre los boletos activos para crear objetos 'shared' si no existen.
          this.boletoTemp.forEach((blt: any) => {
            if (!blt.shared) {
              // Prepara los datos para crear el objeto shared
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
              // Crea el objeto shared
              this.sharedService.crearShared(data).subscribe((res: any) => {
                // Actualiza el boleto con el UID del shared recién creado
                const actBol = {
                  ...blt,
                  shared: res.shared.uid
                }
                this.boletosService.actualizarBoleto(actBol).subscribe(() => {
                  // Lógica adicional, no se usa 'data.boleto' posteriormente
                })
              })
            }
          });
          // Vuelve a cargar los datos de la fiesta después de las actualizaciones
          this.getFiesta(this.fiesta.uid)
        },
          (error: any) => {
            this.functionsService.alertError(error, 'Boletos')
          })
      });
  }

  /**
   * Hook de destrucción del componente.
   * Desuscribe el observable de polling para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    if (this.obs1) this.obs1.unsubscribe();
  }

  /**
   * Asigna la URL segura del código QR.
   * @param url URL segura del QR.
   */
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  /**
   * Carga los datos de una fiesta específica y actualiza los mensajes predeterminados.
   * Se usa en el polling.
   * @param id UID de la fiesta.
   */
  getFiesta(id: string) {
    this.fiestasService.cargarFiestaById(id).subscribe((resp: any) => {
      this.fiesta = resp.fiesta
      // Asigna el mensaje de la fiesta o el temporal si está vacío/indefinido
      this.mensaje = (this.fiesta.mensaje == '' || this.fiesta.mensaje === undefined) ? this.mensajeTemp : resp.fiesta.mensaje
      this.recordatorio = resp.fiesta.recordatorio
    })
  }

  /**
   * Carga los datos iniciales de la fiesta, establece el máximo de invitados y el formulario.
   * Se usa en el constructor.
   * @param id UID de la fiesta.
   */
  getId(id: string) {
    this.fiestasService.cargarFiestaById(id).subscribe((resp: any) => {
      this.fiesta = resp.fiesta
      // Asigna el mensaje de la fiesta o el temporal si está vacío/indefinido
      this.mensaje = (this.fiesta.mensaje == '' || this.fiesta.mensaje === undefined) ? this.mensajeTemp : resp.fiesta.mensaje
      this.recordatorio = resp.fiesta.recordatorio
      this.numeroInvitados = this.fiesta.cantidad // Cantidad máxima de invitados
      this.setForm(this.fiesta) // Inicializa el formulario con datos
    })
  }

  /**
   * Inicializa la estructura base del formulario reactivo.
   */
  createForm() {
    this.form = this.fb.group({
      fiesta: ['', [Validators.required]],
      llena: [false], // No usado visiblemente
      invitados: this.fb.array([]), // Array para los boletos/invitados
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario principal.
   */
  get errorControl() {
    return this.form.controls;
  }

  /**
   * Inicializa el formulario con los datos de la fiesta y carga los boletos para llenar el FormArray.
   * @param fiesta Objeto Fiesta con los datos.
   */
  setForm(fiesta: Fiesta) {
    setTimeout(() => {
      this.form = this.fb.group({
        fiesta: [fiesta.nombre, [Validators.required]],
        llena: [false],
        invitados: this.fb.array([]),
        activated: [fiesta.activated],
        dateCreated: [fiesta.dateCreated],
        lastEdited: [this.today],
      })
      // Carga los boletos asociados a la fiesta
      this.boletosService.cargarBoletoByFiesta(this.id).subscribe((resp: CargarBoleto) => {
        this.boleto = resp.boleto
        // Itera sobre los boletos para agregarlos al FormArray
        this.boleto.forEach((invitado: any) => {
          this.invitados.push(this.setInvitado(invitado))
        });
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
        })
    }, 500);
  }

  /**
   * Alterna la visibilidad del editor del mensaje de WhatsApp.
   */
  verMensaje() {
    this.mensajeOk = !this.mensajeOk
  }

  /**
   * Guarda el mensaje de WhatsApp actualizado en la fiesta.
   * @param mensaje El nuevo texto del mensaje.
   */
  guardarMensaje(mensaje: string) {
    this.loading = true
    this.fiesta.mensaje = mensaje
    this.fiestasService.actualizarFiesta(this.fiesta).subscribe((res: any) => {
      this.mensaje = res.fiestaActualizado.mensaje
      this.mensajeOk = !this.mensajeOk
      this.loading = false
      this.functionsService.alertUpdate('Mensaje WhatsApp')
    })

  }

  /**
   * Alterna la visibilidad del editor del recordatorio.
   */
  verRecordatorio() {
    this.recordatorioOk = !this.recordatorioOk
  }

  /**
   * Guarda el recordatorio actualizado en la fiesta.
   * @param recordatorio El nuevo texto del recordatorio.
   */
  guardarRecordatorio(recordatorio: string) {
    this.loading = true
    this.fiesta.recordatorio = recordatorio
    this.fiestasService.actualizarFiesta(this.fiesta).subscribe((res: any) => {
      this.recordatorio = res.fiestaActualizado.recordatorio
      this.recordatorioOk = !this.recordatorioOk
      this.loading = false
      this.functionsService.alertUpdate('Recordatorio de fiesta')
    })

  }

  /**
   * Carga los catálogos de Fiestas (todos), Grupos e Invitación.
   */
  getCatalogos() {
    this.loading = true
    // Carga todas las fiestas activas
    this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
      this.fiestas = this.functionsService.getActives(resp.fiestas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
    // Carga todos los grupos activos
    this.gruposService.cargarGruposAll().subscribe((resp: CargarGrupos) => {
      this.grupos = this.functionsService.getActives(resp.grupos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
    // Carga la invitación de la fiesta actual
    this.invitacionService.cargarInvitacionByFiesta(this.id).subscribe((resp: CargarInvitacion) => {
      this.invitacion = resp.invitacion
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
  }

  /**
   * Getter para el FormArray de invitados.
   */
  get invitados(): FormArray {
    return this.form.get('invitados') as FormArray
  }

  /**
   * Crea un nuevo FormGroup vacío para un nuevo invitado/boleto.
   */
  newInvitado(): FormGroup {
    return this.fb.group({
      uid: [''], // Se espera que esté vacío para un nuevo boleto
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

  /**
   * Crea un FormGroup con los datos existentes de un boleto.
   * @param invitado Objeto boleto con los datos.
   */
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

  /**
   * Determina si el botón de guardar debe estar deshabilitado.
   * Se deshabilita si la suma total de invitados excede la capacidad de la fiesta y 'checking' está activo.
   */
  getDisabled(): boolean {
    if (this.numeroInvitados < this.total && this.fiesta.checking) {
      return true
    } else {
      return false
    }
  }

  /**
   * Genera la cadena JSON para el código QR de un boleto.
   * Devuelve una estructura con UID, fiesta, grupo, y salón.
   * @param invitado FormGroup del invitado.
   */
  getQr(invitado: FormGroup): string {
    // Lógica para manejar si el 'salon' es un objeto o solo un ID (string)
    if ((invitado.value !== undefined) && typeof (invitado.value.salon) === 'object') {
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

  /**
   * Genera la URL para el código QR que enlaza a la invitación compartida (shared).
   * @param invitado FormGroup del invitado.
   */
  getQrInvitacion(invitado: FormGroup): string {
    // Si el salon es un objeto, genera QR con IDs básicos (caso de un nuevo boleto sin UID aún)
    if ((invitado.value !== undefined) && typeof (invitado.value.salon) === 'object') {
      let qr = {
        uid: '',
        fiesta: this.fiesta.uid,
        grupo: '',
        salon: invitado.value.salon._id,
      }
      return JSON.stringify(qr)
    } else {
      // Si ya hay boletos temporales cargados (con shared ID)
      if (this.boletoTemp) {
        let blt = this.boletoTemp.filter((blt: any) => { return blt.uid === invitado.value.uid })
        if (blt.length > 0 && blt[0].shared) {
          let url = `${this.urlT}shared?evt=${blt[0].shared}`
          return url
        }
        return ''
      } else {
        return ''
      }
    }
  }

  /**
   * Actualiza el contador de 'numeroInvitados' con el total de invitados de una fiesta seleccionada.
   * Función que parece obsoleta ya que la fiesta se carga por ruta ID.
   * @param event Evento de selección (contiene el ID de la fiesta).
   */
  selectNumero(event: any) {
    this.numeroInvitados = this.functionsService.getValueCatalog(event, 'cantidad', this.fiestas)
  }

  /**
   * Reduce el contador de 'numeroInvitados' al escribir en un input.
   * Función que parece obsoleta o mal implementada para el flujo de un FormArray.
   * @param event Evento de entrada de texto.
   */
  cuentaInvitados(event: any) {
    this.numeroInvitados = this.numeroInvitados - Number(event.target.value)
  }

  /**
   * Agrega un nuevo FormGroup vacío al FormArray de invitados.
   */
  addInvitados() {
    this.invitados.push(this.newInvitado())
    this.submited = false
    // Desplaza la vista al final de la página
    window.scrollTo(0, (document.body.scrollHeight - 100));
  }

  /**
   * Marca un boleto como inactivo (eliminación lógica) y recarga el formulario.
   * @param i Índice del FormGroup en el FormArray a eliminar.
   */
  removeInvitados(i: number) {
    this.boletosService.isActivedBoleto(this.form.value.invitados[i]).subscribe(() => {
      this.setForm(this.fiesta) // Recarga el formulario para actualizar la lista
      this.functionsService.alertUpdate('Boletos')
    })
  }

  /**
   * Maneja el envío del formulario: crea o actualiza boletos.
   */
  onSubmit() {
    this.ngOnDestroy() // Detiene el polling
    this.submited = true
    this.loading = true
    this.form.value.fiesta = this.fiesta.uid // Asegura que el UID de la fiesta esté en el objeto

    // Itera sobre los boletos en el FormArray
    this.form.value.invitados.forEach((boleto: any, index: number) => {
      if (boleto.uid == '') {
        // Crear nuevo boleto
        this.boletosService.crearBoleto(boleto).subscribe(() => {
          this.handleSubmitCompletion(index)
        }, (error) => {
          this.loading = false
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Boletos')
        })
      } else {
        // Actualizar boleto existente
        this.boletosService.actualizarBoleto(boleto).subscribe(() => {
          this.handleSubmitCompletion(index)
        }, (error) => {
          this.loading = false
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Boletos')
        })
      }
    });
    this.loading = false // Se establece aquí pero se puede sobrescribir en el error/completion
    return
  }

  /**
   * Lógica de finalización de envío de boleto. 
   * Navega si es el último boleto procesado.
   * @param index Índice del boleto actual.
   */
  handleSubmitCompletion(index: number) {
    if ((this.form.value.invitados.length - 1) === index) {
      this.functionsService.alertUpdate('Boletos')
      if (this.role == this.URS) {
        this.functionsService.navigateTo('mis-fiestas')
      } else {
        this.functionsService.navigateTo('boletos/vista-boletos')
      }
      this.ngOnDestroy() // Detiene el polling de nuevo, aunque ya se detuvo al inicio
    }
  }

  /**
   * Calcula la suma total de 'cantidadInvitados' de los boletos activos en el FormArray.
   */
  get total(): number {
    var total = 0
    this.form.value.invitados.forEach((c: any) => {
      if (c.activated) {
        total = total + Number(c.cantidadInvitados)
      }
    });
    return total
  }

  /**
   * Carga todas las fiestas activas.
   * Función redundante ya que 'getCatalogos' la llama.
   */
  getFiestas() {
    this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
      this.fiestas = this.functionsService.getActives(resp.fiestas)
    }, (error) => {
      console.error('error::: ', error);
      this.functionsService.alertError(error, 'Boletos')
    })
  }

  /**
   * Navega de regreso a la lista de fiestas/boletos y detiene el polling.
   */
  back() {
    this.ngOnDestroy()
    if (this.role == this.URS) {
      this.functionsService.navigateTo('mis-fiestas')
    } else {
      this.functionsService.navigateTo('boletos/vista-boletos')
    }
  }

  /**
   * Navega de regreso a la lista de fiestas (versión para usuario - URS).
   */
  backURS() {
    this.functionsService.navigateTo('mis-fiestas')
  }

  /**
   * Obtiene el valor de un catálogo (actualmente solo 'fiesta').
   * @param tipo El tipo de catálogo ('fiesta').
   * @param id El UID del elemento a buscar.
   */
  getCatalog(tipo: string, id: string) {
    switch (tipo) {
      case 'fiesta':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.fiestas)
        break;
    }
    return null
  }

  /**
   * Prepara la imagen seleccionada para ser subida y la sube al servicio de archivos.
   * @param file Evento de cambio de archivo.
   * @param fiesta Objeto fiesta al que pertenece la imagen (no usado en la lógica interna, se usa en 'subirImagen').
   */
  cambiarImagen(file: any, fiesta: any) {
    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result
      }
      this.subirImagen(fiesta)
    }
  }

  /**
   * Sube la imagen de la fiesta al servidor y actualiza la propiedad 'img' de la fiesta.
   * @param fiesta Objeto fiesta.
   */
  subirImagen(fiesta: any) {
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

  /**
   * Proceso de envío de invitación (WhatsApp o Email).
   * 1. Valida capacidad.
   * 2. Guarda/Actualiza el boleto.
   * 3. Muestra alerta de selección (WhatsApp/Email).
   * 4. Gestiona la creación/uso del objeto 'shared' y el envío.
   * @param i Índice del FormGroup en el FormArray.
   */
  enviarInvitacion(i: number) {
    let idBoleto = ''
    var data = null
    // 1. Validación de capacidad
    if (this.numeroInvitados < this.total && this.fiesta.checking) {
      this.functionsService.alert('Boletos', 'Se ha excedido de la cantidad de boletos permitidos', 'error')
      return
    }

    // 2. Guarda o Actualiza el boleto y establece 'idBoleto'
    if (this.form.value.invitados[i].uid) {
      this.actualizarBoleto(this.form.value.invitados[i])
    } else {
      this.saveBoleto(this.form.value.invitados[i])
    }

    setTimeout(() => {
      window.scrollTo(0, 800);
      // 3. Alerta de selección de método de envío
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
        // 4. Carga el objeto Shared
        this.sharedService.cargarSharedsFiestaBoleto(this.fiesta.uid, this.idBoleto).subscribe((res: any) => {

          var sharedT = res.shareds[0] // Objeto shared existente

          if (res.shareds.length == 0) { // Si no existe el shared, crearlo
            // Lógica para crear el objeto 'shared' y actualizar el boleto
            this.handleSharedCreation(i, result)
          } else { // Si ya existe el shared, usarlo
            this.handleSharedUsage(i, result, sharedT)
          }
        })
      });
      this.loading = false // Se establece aquí pero se puede sobrescribir
    }, 500);
  }

  /**
   * Lógica para la creación del objeto 'shared' si no existe.
   * @param i Índice del FormGroup.
   * @param result Resultado del Swal (isConfirmed o isDenied).
   */
  handleSharedCreation(i: number, result: any) {
    var boletoShared = null
    this.boletosService.cargarBoletoById(this.idBoleto).subscribe((resp: CargarBoleto) => {
      boletoShared = resp.boleto
      // 1. Preparar data para Shared
      let data = {
        type: 'invitacion',
        fiesta: this.fiesta.uid,
        boleto: this.idBoleto,
        data: { fiesta: this.fiesta, boleto: boletoShared },
        compartidas: 1,
        vistas: 0,
        usuarioCreated: this.uid,
        activated: true,
        dateCreated: this.today,
        lastEdited: this.today,
      }
      // 2. Crear Shared
      this.sharedService.crearShared(data).subscribe((res: any) => {
        const sharedId = res.shared.uid
        const actBol = { ...boletoShared, shared: res.shared.uid }
        // 3. Actualizar Boleto con Shared ID
        this.boletosService.actualizarBoleto(actBol).subscribe((resBol: any) => {
          data.boleto = resBol.boletoActualizado
          // 4. Enviar WhatsApp o Email
          if (result.isConfirmed) {
            this.sendWhatsapp(i, sharedId)
          } else if (result.isDenied) {
            this.sendEmail(i, sharedId)
          } else {
            this.loading = false
          }
        })
      })
    })
  }

  /**
   * Lógica para el uso del objeto 'shared' existente.
   * @param i Índice del FormGroup.
   * @param result Resultado del Swal (isConfirmed o isDenied).
   * @param sharedT Objeto shared existente.
   */
  handleSharedUsage(i: number, result: any, sharedT: any) {
    if (result.isConfirmed) {
      sharedT.compartidas = sharedT.compartidas + 1
      this.sharedService.actualizarShared(sharedT).subscribe(() => {
        this.sendWhatsapp(i, sharedT.uid)
      })
    } else if (result.isDenied) {
      sharedT.compartidas = sharedT.compartidas + 1
      this.sharedService.actualizarShared(sharedT).subscribe(() => {
        this.sendEmail(i, sharedT.uid)
      })
    } else {
      this.loading = false
    }
  }

  /**
   * Prepara y envía la invitación por WhatsApp.
   * @param i Índice del FormGroup.
   * @param sharedId UID del objeto shared.
   */
  sendWhatsapp(i: number, sharedId: string) {
    let invitacion = this.form.value.invitados[i]
    let tel = invitacion.whatsapp
    let nGrupo = invitacion.nombreGrupo
    let cantP = Number(invitacion.cantidadInvitados)
    let evento = this.fiesta.nombre

    let ligaEvento = `${this.urlT}shared?evt=${sharedId}`

    // 1. Reemplazar placeholders en el mensaje
    let mensajeFinal = (this.fiesta.mensaje == '') ? this.mensajeTemp : this.fiesta.mensaje
    mensajeFinal = mensajeFinal.replace('@@invitado@@', nGrupo.toLocaleUpperCase())
    mensajeFinal = mensajeFinal.replace('@@cantidadInvitados@@', cantP)
    mensajeFinal = mensajeFinal.replace('@@nombre_evento@@', evento)
    mensajeFinal = mensajeFinal.replace('@@liga_evento@@', ligaEvento)
    // 2. Generar URL de WhatsApp
    let url = `https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(mensajeFinal)}`
    // 3. Abrir ventana y notificar
    Swal.fire({ title: "Enviado por whatsapp!", text: "", icon: "success", confirmButtonColor: "#13547a" });
    window.open(url, '_blank');
    // 4. Actualizar estado de envío en el boleto
    invitacion.invitacionEnviada = true
    this.boletosService.actualizarBoleto(invitacion).subscribe(() => {
      this.loading = false
      this.functionsService.alertUpdate('Boletos')
    }, (error) => {
      console.error('error::: ', error);
      this.loading = false
      this.functionsService.alertError(error, 'Boletos')
    })
  }

  /**
   * Envía la invitación por Correo Electrónico.
   * @param i Índice del FormGroup.
   * @param sharedId UID del objeto shared.
   */
  sendEmail(i: number, sharedId: string) {
    let bol = {
      ...this.form.value.invitados[i],
      text_url: this.urlT // Asegura que el servicio de email tenga la URL base
    }
    this.emailsService.sendMailByBoleto(bol).subscribe(() => {
      this.loading = false
      // Se asume que el contador de 'compartidas' ya se actualizó en 'handleSharedUsage'
      Swal.fire({ title: "Enviado por Correo!", text: "", icon: "success", confirmButtonColor: "#13547a" });
    },
      (error) => {
        console.error('error::: ', error);
        this.loading = false
        this.functionsService.alertError(error, 'Boletos')
      })
  }

  /**
   * Abre un modal (usado para mostrar confirmados).
   * @param content Referencia al template del modal.
   */
  showConfirmados(content: any) {
    this.modalService.open(content);
  }

  /**
   * Crea un nuevo boleto en la base de datos y actualiza 'idBoleto'.
   * @param boleto Objeto boleto a guardar.
   */
  saveBoleto(boleto: any) {
    this.boletosService.crearBoleto(boleto).subscribe((resp: any) => {
      this.idBoleto = resp.boleto.uid
      this.functionsService.alertUpdate('Boletos')
      this.setForm(this.fiesta) // Recarga el form para incluir el nuevo boleto con UID
    },
      (error) => {
        console.error('error::: ', error);
        this.loading = false
        this.functionsService.alertError(error, 'Boletos')
      })
  }

  /**
   * Actualiza un boleto existente en la base de datos y actualiza 'idBoleto'.
   * @param boleto Objeto boleto a actualizar.
   */
  actualizarBoleto(boleto: any) {
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

  /**
   * Copia el enlace de la invitación compartida (shared link) al portapapeles.
   * @param fiesta UID de la fiesta (no usado).
   * @param boleto UID del boleto.
   */
  copiarLink(fiesta: any, boleto: string) {
    // Carga el objeto Shared (solo para asegurar que exista/esté actualizado)
    this.sharedService.cargarSharedsFiestaBoleto(this.fiesta.uid, boleto).subscribe(() => {
      // Carga el boleto para obtener el UID del 'shared'
      this.boletosService.cargarBoletoById(boleto).subscribe((resb: any) => {
        var url = this.urlT + 'shared/?evt=' + resb.boleto.shared
        console.log('url::: ', url);
        // Lógica para copiar al portapapeles
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

  // Las funciones 'upload' y 'uploadBoletos' contienen lógica de importación de Excel. 
  // 'uploadBoletos' es una versión más robusta con validación y manejo asíncrono.

  /**
   * **(Versión simplificada y menos robusta de carga de Excel)**
   * Lee un archivo Excel, lo convierte a JSON, elimina todos los boletos existentes (deleteBoletos),
   * y luego crea nuevos boletos con los datos importados. Recarga la página al finalizar.
   * @param event Evento de selección de archivo.
   */
  upload(event: any) {
    this.loading = true
    const selectedFile = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(selectedFile)
    fileReader.onload = (event) => {
      // Conversión de Excel a JSON
      let binaryData = event.target!.result as string
      let workbook = XLSX.read(binaryData, { type: 'binary' })
      workbook.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        this.convertedJson.push(data)
      })
      // Ajuste de opciones (lógica específica no clara)
      this.convertedJson.forEach((element, i) => {
        element.forEach((ele: any, j: number) => {
          if (typeof (this.convertedJson[i][j].options) == 'string' && this.convertedJson[i][j].options) {
            this.convertedJson[i][j].options = JSON.parse(this.convertedJson[i][j].options)
          }
        });
      });

      // Eliminación masiva de boletos y creación de nuevos
      this.boletosService.deleteBoletos().subscribe(() => {
        this.convertedJson[0].forEach((bol: any) => {
          this.loading = false // Error lógico: debería ser true
          let gpo = this.grupos.filter(f => f.nombre.toLowerCase().trim() === bol.Grupo.toLowerCase().trim())
          let boleto = {
            activated: true,
            cantidadInvitados: bol.Cantidad,
            confirmado: false,
            email: bol.Correo,
            fechaConfirmacion: null,
            fiesta: this.id,
            grupo: gpo.length > 0 ? gpo[0].uid : null, // Manejo de grupo
            nombreGrupo: bol.Nombre,
            invitacionEnviada: false,
            mesa: bol.Mesa,
            ocupados: 0,
            salon: this.fiesta.salon._id,
            whatsapp: bol.Telefono,
            vista: false
          }
          this.saveBoleto(boleto) // Guardar cada boleto
          this.loading = false // Error lógico: debería ser true
        });
        this.loading = false
        // Recarga forzada de la página
        setTimeout(() => { window.location.reload() }, 1500);
      })
    }
  }

  /**
   * **(Versión robusta de carga de Excel)**
   * Lee un archivo Excel, lo convierte a JSON, valida la capacidad de invitados, 
   * mapea y valida los datos, y crea los boletos de forma asíncrona. Recarga los datos al finalizar.
   * @param ev Evento de selección de archivo.
   */
  async uploadBoletos(ev: any) {
    this.loading = true
    let workBook: any = null;
    let jsonData: any = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      // Convierte todas las hojas a JSON (espera hoja llamada 'Invitados')
      jsonData = workBook.SheetNames.reduce((initial: any, name: string) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      const invitadosData = jsonData.Invitados // Asume que la hoja se llama 'Invitados'

      // 1. Conteo y Validación de Capacidad
      let totalI = await this.conteoInvitadosFile(invitadosData)
      if (this.numeroInvitados > 0 && ((totalI + this.total) > this.numeroInvitados)) {
        this.functionsService.alert('Boletos', 'La cantidad de invitados es mayor a la capacidad disponible', 'error')
        setTimeout(() => { this.loading = false }, 1500);
        return
      }

      // 2. Validación y Mapeo de Invitados (busca grupos, crea objetos boleto)
      let invi = await this.validarInvitadosFile(invitadosData)

      // 3. Creación de Boletos
      await this.crearInvitacionesFile(invi) // Espera a que se complete la creación asíncrona

      // 4. Recarga de datos y finalización
      setTimeout(() => { this.getId(this.id) }, 4000); // Recarga los datos de la fiesta y el form
      setTimeout(() => { this.loading = false }, 7000);
    }
    reader.readAsBinaryString(file);
  }

  /**
   * Calcula el total de invitados basado en la columna 'Cantidad' del archivo Excel.
   * @param data Array de objetos importados del Excel.
   */
  async conteoInvitadosFile(data: any[]): Promise<number> {
    let totalFile = 0
    data.forEach(invi => {
      totalFile = totalFile + invi.Cantidad
    });
    return totalFile
  }

  /**
   * Valida y mapea los datos del Excel a la estructura de un objeto boleto.
   * Asume que las columnas se llaman 'Grupo', 'Cantidad', 'Correo Electronico', etc.
   * @param data Array de objetos importados del Excel.
   */
  async validarInvitadosFile(data: any[]): Promise<any[]> {
    var invitados: any[] = []
    data.forEach((invi) => {
      // Busca el UID del grupo por nombre (case insensitive, trim)
      this.grupos.forEach(gpo => {
        if ((gpo.nombre.toLowerCase().trim()) == (invi.Grupo.toLowerCase().trim())) {
          let invitado = {
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
    return invitados
  }

  /**
   * Crea boletos en la base de datos de forma asíncrona.
   * @param data Array de objetos boleto validados.
   */
  async crearInvitacionesFile(data: any[]): Promise<void> {
    const promises = data.map(invi =>
      new Promise(resolve => {
        this.boletosService.crearBoleto(invi).subscribe(res => {
          resolve(res) // Resuelve la promesa al crear el boleto
        })
      })
    )
    await Promise.all(promises) // Espera a que todos los boletos se creen
  }

  /**
   * Exporta la lista de boletos activos a un archivo Excel (.xlsx).
   */
  exportToExcel(): void {
    // 1. Mapear y formatear datos
    let blts: any[] = []
    this.boletoTemp.forEach((b: any) => {
      if (b.activated) {
        let blt = {
          "Asistirá": (b.confirmado == null || b.confirmado) ? "✅" : "❌",
          "Invitado": b.nombreGrupo.toUpperCase(),
          "Cantidad": (!this.fiesta.checking) ? "N/A" : b.cantidadInvitados,
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

    // 2. Crear hoja de cálculo y libro
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(blts);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Invitados': worksheet },
      SheetNames: ['Invitados']
    };

    // 3. Generar buffer y guardar archivo
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    let fileName = this.fiesta.nombre + this.functionsService.numberDateTimeLocal(this.today) + '.xlsx'
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, fileName);
  }




}