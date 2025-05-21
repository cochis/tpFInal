import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarPost } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Post } from 'src/app/core/models/post.model';
import { PostsService } from 'src/app/core/services/post.service';

import { Editor, Toolbar } from 'ngx-editor';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { FileService } from 'src/app/core/services/file.service';
@Component({
  selector: 'app-editar-post',
  templateUrl: './editar-post.component.html',
  styleUrls: ['./editar-post.component.scss']
})
export class EditarPostComponent implements OnDestroy {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  post: Post
  public form!: FormGroup

  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  categorias=environment.categoriasPost
  url = environment.base_url
  contenido: Editor
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fileService: FileService,
    private postsService: PostsService,

    private route: ActivatedRoute,

  ) {
    this.contenido = new Editor();
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

    this.postsService.cargarPostById(id).subscribe((resp: CargarPost) => {

      this.post = resp.post

      setTimeout(() => {

        this.setForm(this.post)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Posts')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      titulo: ['',],
      categoria: ['',],
      contenido: ['',],
      autor: ['',],
      img: ['',],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(post: Post) {



    this.form = this.fb.group({
      titulo: [post.titulo,],
      categoria: [post.categoria,],
      contenido: [post.contenido,],
      autor: [post.autor,],
      img: [post.img,],
      activated: [post.activated],
      dateCreated: [post.dateCreated],
      lastEdited: [this.today],
    })
    
    console.log(" this.form: ",  this.form);
  }
  
  onSubmit() {
    this.loading = true
    this.submited = true
  
    if (this.form.valid) {

      this.post = {
        ...this.post,
        ...this.form.value,


      }
      this.postsService.actualizarPost(this.post).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Posts')
        this.functionsService.navigateTo('core/posts/vista-posts')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Posts')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }
  cambiarImagen(file: any, type) {

    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null

    } else {


      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result

      }
      this.subirImagen(type)

    }
  }
  subirImagen(type?) {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'posts', this.post.uid)
      .then(
        (img) => {
          console.log('img::: ', img);
          this.post.img = img

          //message
          this.loading = false
          this.imgTemp = undefined



          this.setForm(this.post)

        },
        (err) => {
          console.error('error::: ', err);

        },
      )
  }

  back() {
    this.functionsService.navigateTo('core/posts/vista-posts')
  }
  ngOnDestroy() {
    this.contenido.destroy();

  }

}

