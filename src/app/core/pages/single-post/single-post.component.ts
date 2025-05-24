import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '../../services/meta.service';
import { PostsService } from '../../services/post.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { CargarPost } from '../../interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent {
  loading = false
  id!: string
  post: Post
  contenidoHTML: SafeHtml;
  constructor(
    private metaService: MetaService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private postService: PostsService,
    private functionsService: FunctionsService,
  ) {
    this.id = this.route.snapshot.params['id']

    this.getId(this.id)
  }



  getId(id) {
    this.loading = true
    this.postService.cargarPostById(id).subscribe((resp: CargarPost) => {
      this.post = resp.post

      this.loading = false
    }, (error) => {
      this.loading = false
      console.error("error: ", error);

    })
  }
  convertDes(des: string) {
    return this.functionsService.convertDesComplete(des)

  }
}
