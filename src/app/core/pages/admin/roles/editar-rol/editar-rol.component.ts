import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRole, CargarRoles, CargarSalons, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar-rol',
  templateUrl: './editar-rol.component.html',
  styleUrls: ['./editar-rol.component.css']
})
export class EditarRolComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  rol: Role
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private fileService: FileService,
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

    this.loading = true
    this.rolesService.cargarRoleById(id).subscribe((resp: CargarRole) => {

      this.rol = resp.role

      setTimeout(() => {

        this.setForm(this.rol)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alert('Roles', 'Por favor intente mas tarde', 'error')


      })
  }




  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(role: Role) {

    this.form = this.fb.group({
      nombre: [role.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [role.clave, [Validators.required, Validators.minLength(3)]],
      activated: [role.activated],
      dateCreated: [role.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Roles')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.rol = {
        ...this.rol,
        ...this.form.value,


      }

      this.rolesService.actualizarRole(this.rol).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Roles')
        this.functionsService.navigateTo('core/roles/vista-roles')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Roles')
          this.loading = false



        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return console.log('Please provide all the required values!');
    }


  }


  back() {
    this.functionsService.navigateTo('core/roles/vista-roles')
  }

}
