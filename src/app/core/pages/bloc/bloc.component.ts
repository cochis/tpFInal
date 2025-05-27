import { Component } from '@angular/core';
import { PostsService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { CargarPosts } from '../../interfaces/cargar-interfaces.interfaces';
import { environment } from 'src/environments/environment';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-bloc',
  templateUrl: './bloc.component.html',
  styleUrls: ['./bloc.component.scss']
})
export class BlocComponent {
  posts: Post[]
  url = environment.base_url
  catePosts = [
    { categoria: '1', post: [] },
    { categoria: '2', post: [] },
    { categoria: '3', post: [] },
    { categoria: '4', post: [] },
    { categoria: '5', post: [] },
  ]
  constructor(
    private postService: PostsService,
    private functionsService: FunctionsService
  ) {
    this.postService.cargarPostsAll().subscribe((resp: CargarPosts) => {

      this.posts = this.functionsService.getActives(resp.posts)

      this.posts.forEach(p => {
        this.catePosts.forEach((cp, i) => {
          if (p.categoria === cp.categoria) {
            this.catePosts[i].post.push(p)
          }
        });

      });


    })
  }
  isRegister(value) {
    let num = 0
    const r = this.posts.filter(p => {
      return p.categoria === value
    })
    if (r.length == 0) {
      return false
    } else {
      return true
    }
  }
   
}
