import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '../../services/meta.service';
import { PostsService } from '../../services/post.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { CargarPost } from '../../interfaces/cargar-interfaces.interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent {
  loading = false
  id!: string
  post: Post
  URL=environment.base_url
  contenidoHTML: SafeHtml;
  constructor(
    private metaService: MetaService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private postService: PostsService,
    private functionsService: FunctionsService,
        private meta: Meta,
        private titleService: Title,
  ) {
    this.id = this.route.snapshot.params['id']

     this.loading = true
    this.postService.cargarPostById(this.id).subscribe((resp: CargarPost) => {
      this.post = resp.post
      console.log(" this.post : ",  this.post );

      this.loading = false
    }, (error) => {
      this.loading = false
      console.error("error: ", error);

    })
  }

  ngOnInit(): void {
    setTimeout(() => {
      const titulo = 'Preguntas Frecuentes | ' + this.post.titulo  +' | MyTicketParty';
    const descripcion = this.eliminarEtiquetasHTML(this.post.contenido) .slice(0, 200)+ '...'

    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion},
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: this.URL+'/upload/posts/'+this.post.img },
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

  getId(id) {
    this.loading = true
    this.postService.cargarPostById(id).subscribe((resp: CargarPost) => {
      this.post = resp.post
      console.log(" this.post : ",  this.post );

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
