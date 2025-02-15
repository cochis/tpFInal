import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarSalon, CargarSalons, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FileService } from 'src/app/core/services/file.service';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { MapsService } from '../../../../../shared/services/maps.service';
@Component({
  selector: 'app-editar-salon',
  templateUrl: './editar-salon.component.html',
  styleUrls: ['./editar-salon.component.css']
})
export class EditarSalonComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  salon: Salon

  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  submited: boolean = false
  sendCoords: any = undefined
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private fiestasService: FiestasService,
    private invitacionesServices: InvitacionsService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private mapService: MapsService
  ) {
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getId(id: string) {


    this.salonesService.cargarSalonById(id).subscribe((resp: CargarSalon) => {
      this.loading = true

      this.salon = resp.salon



      setTimeout(() => {

        this.setForm(this.salon)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Salones')
        this.loading = false

      })
  }



  get errorControl() {
    return this.form.controls;


  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numeroExt: ['', [Validators.required]],
      numeroInt: [''],
      municipioDelegacion: ['', [Validators.required]],
      coloniaBarrio: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.pattern(".{5,5}")]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      comoLlegar: ['', [Validators.required]],
      lat: [''],
      long: [''],
      telefono: ['', [Validators.required, Validators.pattern(".{10,10}")]],
      email: [this.functionsService.getLocal('email'), [Validators.required, Validators.email]],
      ubicacionGoogle: [''],
      img: [''],
      activated: [false],
      dateCreated: [''],
      lastEdited: [this.today],
    })
  }
  setForm(salon: Salon) {
    if (salon.long && salon.lat) {
      this.sendCoords = [Number(salon.long), Number(salon.lat)]
    } else {
      this.mapService.getUserLocation().then(res => {
        this.sendCoords = res
      })
    }
    this.form = this.fb.group({
      nombre: [salon.nombre, [Validators.required]],
      calle: [salon.calle, [Validators.required]],
      numeroExt: [salon.numeroExt, [Validators.required]],
      numeroInt: [salon.numeroInt],
      municipioDelegacion: [salon.municipioDelegacion, [Validators.required]],
      coloniaBarrio: [salon.coloniaBarrio, [Validators.required]],
      cp: [salon.cp, [Validators.required, Validators.pattern(".{5,5}")]],
      estado: [salon.estado, [Validators.required]],
      pais: [salon.pais, [Validators.required]],
      direccion: [salon.calle + ' ' + salon.numeroExt + ((salon.numeroInt == '') ? '' : ', Int.' + salon.numeroInt) + ', colonia o barrio, ' + salon.coloniaBarrio + ', municipio o delegación' + salon.municipioDelegacion + ', estado' + salon.estado + ', en' + salon.pais],
      comoLlegar: [salon.comoLlegar, [Validators.required]],
      lat: [salon.lat],
      long: [salon.long],
      telefono: [salon.telefono, [Validators.required, Validators.pattern(".{10,10}")]],
      email: [salon.email, [Validators.required, Validators.email]],
      ubicacionGoogle: [salon.ubicacionGoogle ? salon.ubicacionGoogle : ''],
      img: [this.salon.img],
      activated: [true],
      dateCreated: [salon.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()

    if (this.form.value.nombre === ''
      || this.form.value.direccion === ''
      || this.form.value.telefono === ''
      || this.form.value.email === ''
    ) {
      this.functionsService.alertForm('Salones')
      this.loading = false
      return
    }
    this.loading = true
    if (this.form.valid) {

      let dir = this.form.value.calle + ' ' + this.form.value.numeroExt + ((this.form.value.numeroInt == '') ? '' : ', Int.' + this.form.value.numeroInt) + ', colonia o barrio ' + this.form.value.coloniaBarrio + ', municipio o delegación ' + this.form.value.municipioDelegacion + ', estado ' + this.form.value.estado + ', en ' + this.form.value.pais

      this.salon = {

        ...this.salon,
        ...this.form.value,
        direccion: dir,
        img: this.salon.img


      }

      this.salonesService.actualizarSalon(this.salon).subscribe((resp: any) => {
        this.fiestasService.cargarFiestasBySalon(this.salon.uid).subscribe((res: any) => {
          if (res.fiestas.length == 0) {
            this.functionsService.alertUpdate('Salon')
            this.functionsService.navigateTo('core/salones/vista-salones')
          } else {
            let fsts: any = this.functionsService.getActives(res.fiestas)
            fsts.forEach(fst => {
              this.invitacionesServices.cargarInvitacionByFiesta(fst.uid).subscribe(((r: any) => {
                if (r.invitacion) {
                  let inv = {
                    ...r.invitacion,
                    data: {

                      ...r.invitacion.data,
                      donde3AddressUbicacion: this.salon.ubicacionGoogle,
                      donde3Address: this.salon.direccion,
                      donde3Img: this.salon.img,
                      donde3Text: this.salon.nombre,
                      donde3Title: this.salon.nombre,
                    },
                    fiesta: (typeof (r.invitacion.fiesta) == 'object') ? r.invitacion.fiesta._id : r.invitacion.fiesta,
                    usuarioCreated: (typeof (r.invitacion.usuarioCreated) == 'object') ? r.invitacion.usuarioCreated._id : r.invitacion.usuarioCreated
                  }

                  this.invitacionesServices.actualizarInvitacion(inv).subscribe(ri => {

                    this.functionsService.alertUpdate('Salon e Invitaciones')
                    this.functionsService.navigateTo('core/salones/vista-salones')


                  })
                  this.functionsService.alertUpdate('Salon')
                  this.functionsService.navigateTo('core/salones/vista-salones')

                } else {
                  this.functionsService.alertUpdate('Salon')
                  this.functionsService.navigateTo('core/salones/vista-salones')
                }

              }))




            });
          }








        })



        // 
        this.loading = false
      },
        (error) => {


          this.functionsService.alertError(error, 'Salones')
          this.loading = true


        })
    } else {

      this.functionsService.alertForm('Salones')
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }
  cambiarImagen(file: any) {
    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null

    } else {
      ;

      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result


      }
      this.subirImagen()

    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'salones', this.salon.uid)
      .then(
        (img) => {


          this.salon.img = img

          this.functionsService.alert('Salon', 'Imagen actualizada', 'success')
        },
        (err) => {

          //message

        },
      )
  }
  showCoordenadas(e) {
    this.form.patchValue({

      lat: e.lat,
      long: e.lng,
      ubicacionGoogle: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`
    })



  }
  back() {
    this.functionsService.navigateTo('core/salones/vista-salones')
  }

}
