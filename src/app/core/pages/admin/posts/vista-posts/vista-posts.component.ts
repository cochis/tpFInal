import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { PostsService } from 'src/app/core/services/post.service';
import { Post } from 'src/app/core/models/post.model';
import { CargarPosts } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-posts',
  templateUrl: './vista-posts.component.html',
  styleUrls: ['./vista-posts.component.scss']
})
export class VistaPostsComponent {
  data!: any
  posts: Post[]
  postsTemp: Post[]
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')


  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,

    private postsService: PostsService
  ) {
    this.getPosts()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.posts = this.postsTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.postsTemp)
      this.posts = this.functionsService.filterBy(termino, this.postsTemp)
    }, 500);
  }




  setPosts() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getPosts() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.postsService.cargarPostsAll().subscribe((resp: CargarPosts) => {

        this.posts = resp.posts
        this.postsTemp = resp.posts
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Posts')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.postsService.cargarPostsByEmail(usr).subscribe((resp: CargarPosts) => {

        this.posts = resp.posts
        this.postsTemp = resp.posts
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editPost(id: string) {

    this.functionsService.navigateTo(`/core/posts/editar-post/true/${id}`)

  }
  isActived(post: Post) {

    this.postsService.isActivedPost(post).subscribe((resp: any) => {
      this.getPosts()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Posts')

      })
  }
  viewPost(id: string) {
    this.functionsService.navigateTo(`/core/posts/editar-post/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newPost() {

    this.functionsService.navigateTo('core/posts/crear-post')
  }

}
