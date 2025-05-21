import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Post } from 'src/app/core/models/post.model';
import { CargarPost, CargarPosts } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private functionsService: FunctionsService,) { }
  get token(): string {
    return this.functionsService.getLocal('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  cargarPostsAll() {
    const url = `${base_url}/posts/all`
    return this.http.get<CargarPosts>(url, this.headers).pipe(
      map((resp) => {
        const posts = resp.posts.map(
          (pst) =>
            new Post(
              pst.titulo,
              pst.contenido,
              pst.autor,
              pst.img,
              pst.usuarioCreated,
              pst.activated,
              pst.dateCreated,
              pst.lastEdited,
              pst.uid,

            ),
        )
        return {
          total: posts.length,
          posts,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/posts?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarPosts>(url, this.headers).pipe(
      map((resp) => {
        const posts = resp.posts.map(
          (pst) =>
            new Post(
              pst.titulo,
              pst.contenido,
              pst.autor,
              pst.img,
              pst.usuarioCreated,
              pst.activated,
              pst.dateCreated,
              pst.lastEdited,
              pst.uid,

            ),
        )
        return {
          total: posts.length,
          posts,
        }
      }),
    )
  }
  crearPost(formData: Post) {
    return this.http.post(`${base_url}/posts`, formData, this.headers)
  }


  isActivedPost(post: Post) {
    const url = `${base_url}/posts/isActive/${post.uid}`
    const data = {
      ...post,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPost(post: Post) {
    const url = `${base_url}/posts/${post.uid}`
    const data = {
      ...post,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPostById(id: string) {
    const url = `${base_url}/posts/${id}`
    return this.http.get<CargarPost>(url, this.headers)
  }
  cargarPostsByEmail(email: string) {
    const url = `${base_url}/posts/email/${email}`
    return this.http.get<CargarPosts>(url, this.headers)
  }
}
