import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-translate',
  templateUrl: './select-translate.component.html',
  styleUrls: ['./select-translate.component.scss']
})
export class SelectTranslateComponent {
  constructor(
    private traductor: TranslateService) {


    this.traductor

  }


  changeLang(type: any) {

    this.traductor.use(type)
  }
}
