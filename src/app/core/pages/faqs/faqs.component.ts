import { Component, OnInit } from '@angular/core';
import { Meta, Title, DomSanitizer, SafeHtml, } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';
import { PostsService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { CargarPosts } from '../../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  posts: Post[]
  constructor(
    private meta: Meta,
    private titleService: Title,
    private postsservice: PostsService,
    private functionsService: FunctionsService,
    private sanitizer: DomSanitizer,
  ) {

    this.postsservice.cargarPostsAll().subscribe((res: CargarPosts) => {
      this.posts = res.posts.filter((p: Post) => {
        return p.categoria == '6'
      })
      this.posts = this.functionsService.getActives(this.posts)


    })
  }
  ngOnInit(): void {
    const titulo = 'Preguntas Frecuentes | Todo lo que Necesitas Saber | MyTicketParty';
    const descripcion = 'Resuelve tus dudas sobre invitaciones digitales, check-in, conteo de invitados, proveedores, pagos y cómo organizar tu evento con MyTicketParty.';
    this.functionsService.removeTags()
    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/faqs' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: 'core/faqs' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }
  convertDes(des: string) {
    return this.sanitizer.bypassSecurityTrustHtml(des);




  }
}
