import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
@Injectable({
  providedIn: 'root'
})
export class TraductorService {
  langs: string[] = []
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es')
    this.translate.use('es')
    this.translate.addLangs(['en', 'es'])
    this.langs = this.translate.getLangs()
  }



  public changeLang(type: string) {
    this.translate.use(type)
  }
}
