import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Post } from 'src/app/core/models/post.model';
import { Editor, Toolbar } from 'ngx-editor';
import { PostsService } from 'src/app/core/services/post.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.scss']
})
export class CrearPostComponent implements OnDestroy {
  uid = this.functionsService.getLocal('uid')
  loading = false
  post: Post
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  categorias=environment.categoriasPost
  cargando: boolean = false
  msnOk: boolean = false
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

    private postsService: PostsService,

  ) {
    this.loading = true
    this.contenido = new Editor();
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    console.log('this.uid::: ', this.uid);

    this.form = this.fb.group({
      titulo: ['',],
      categoria: ['',],
      contenido: ['',],
      autor: ['',],
      img: ['',],
      activated: [false],
      usuarioCreated: [this.uid],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {


      this.postsService.crearPost(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Post', 'Post creado', 'success')
        this.functionsService.navigateTo('core/posts/editar-post/true/'+resp.post.uid)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Posts')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Posts')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/posts/vista-posts')
  }
  ngOnDestroy() {
    this.contenido.destroy();

  }

}

