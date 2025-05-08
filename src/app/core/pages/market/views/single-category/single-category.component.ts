import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss']
})
export class SingleCategoryComponent {
  constructor(private router: Router) { }
  back(): void {


    this.router.navigate(['/core/market']);
  }
}
