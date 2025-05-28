import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '../../services/meta.service';
import { PostsService } from '../../services/post.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { CargarPost } from '../../interfaces/cargar-interfaces.interfaces';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent {
  uid = this.functionsService.getLocal('uid')
  loading = false
  id!: string
  usuario: Usuario
  post: Post
  URL = environment.base_url
  contenidoHTML: SafeHtml;
  respuestaForm: FormGroup;
  rol = this.functionsService.getLocal('role')
  ADM = environment.admin_role
  constructor(
    private metaService: MetaService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private postService: PostsService,
    private usuarioServices: UsuariosService,
    private functionsService: FunctionsService,
    private meta: Meta,
    private titleService: Title,
    private fb: FormBuilder
  ) {
    if (this.rol) {
      this.usuarioServices.cargarUsuarioById(this.uid).subscribe(res => {
        this.usuario = res.usuario
        console.log(' this.usuario::: ', this.usuario);
      })
    }
    this.respuestaForm = this.fb.group({
      autor: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],
      contenido: ['', [Validators.required, Validators.maxLength(500)]]
    });
    setTimeout(() => {
      if (this.usuario) {

        this.respuestaForm = this.fb.group({
          autor: [this.usuario ? this.usuario.nombre : '', [Validators.required, Validators.minLength(3)]],
          email: [this.usuario ? this.usuario.email : '', [Validators.required, Validators.minLength(3)]],
          contenido: ['', [Validators.required, Validators.maxLength(500)]]
        });
      }
    }, 1000);
    this.id = this.route.snapshot.params['id']

    this.loading = true
    this.postService.cargarPostById(this.id).subscribe((resp: CargarPost) => {
      this.post = resp.post

      if (!this.post.respuestas) {
        this.post.respuestas = []
      }
      console.log(" this.post : ", this.post);

      this.loading = false
    }, (error) => {
      this.loading = false
      console.error("error: ", error);

    })
  }
  onSubmit() {

    if (this.respuestaForm.valid) {
      if (!this.post.respuestas) {
        console.log('this.post.respuestas::: ', this.post.respuestas);
        let r = {
          ...this.respuestaForm.value,
          activated: true,
          date: Date.now()
        }
        this.post.respuestas.push(r)
      } else {
        let r = {
          ...this.respuestaForm.value,
          activated: true,
          date: Date.now()
        }
        this.post.respuestas.unshift(r)
      }

      console.log('this.post::: ', this.post);
      this.postService.actualizarPost(this.post).subscribe((res: any) => {
        console.log('res::: ', res);
        this.post = res.postActualizado
      })
      // Aquí puedes enviar los datos al backend
      this.respuestaForm.reset();
    } else {
      console.log('Formulario inválido');
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      const titulo = 'Preguntas Frecuentes | ' + this.post.titulo + ' | MyTicketParty';
      const descripcion = this.eliminarEtiquetasHTML(this.post.contenido).slice(0, 200) + '...'

      this.titleService.setTitle(titulo);

      this.meta.addTags([
        { name: 'author', content: 'MyTicketParty' },
        { name: 'description', content: descripcion },
        { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
        { property: 'og:title', content: titulo },
        { property: 'og:description', content: descripcion },
        { property: 'og:image', content: this.URL + '/upload/posts/' + this.post.img },
        { property: 'og:url', content: 'https://www.myticketparty.com/core/faqs' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: titulo },
        { name: 'twitter:description', content: descripcion },
        { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
        { name: 'slug', content: 'core/faqs' },
        { name: 'colorBar', content: '#13547a' },
      ]);
    }, 100);

  }



  desActComentrio(i) {
    console.log('i::: ', i);
    console.log('this.post::: ', this.post);
    console.log('    this.post.respuestas[i].::: ', this.post.respuestas[i]);
    this.post.respuestas[i].activated = !this.post.respuestas[i].activated
    this.postService.actualizarPost(this.post).subscribe((resp: any) => {
      this.post = resp.postActualizado
    })
  }
  getId(id) {
    this.loading = true
    this.postService.cargarPostById(id).subscribe((resp: CargarPost) => {
      this.post = resp.post
      console.log(" this.post : ", this.post);

      this.loading = false
    }, (error) => {
      this.loading = false
      console.error("error: ", error);

    })
  }
  convertDes(des: string) {
    return this.functionsService.convertDesComplete(des)

  }
  eliminarEtiquetasHTML(cadena) {
    return this.functionsService.eliminarEtiquetasHTML(cadena)
  }
}
