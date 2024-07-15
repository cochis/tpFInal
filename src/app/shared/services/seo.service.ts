import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
 
@Injectable({
   providedIn: 'root'
})
export class SEOService { 
 
  constructor(@Inject(DOCUMENT) private dom) { 
  }
    
  updateCanonicalUrl(url:string){
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement= this.dom.querySelector(`link[rel='canonical']`) || null
    if (element==null) {
      element= this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel','canonical')
    element.setAttribute('href',url)
  }
}  