import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Template } from 'src/app/core/models/template.model';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.css']
})
export class ModalTemplateComponent implements AfterViewInit {
  @Input() model: any;
  @Output() sendRes: EventEmitter<any>;
  @ViewChild('intro') myElement: ElementRef;

  closeResult: string;
  template: Template
  url = environment.base_url
  diseno = ''

  css = ''
  htmlContent = '<h1 style="color: red">Hello World</h1>';
  cssContent = "<h1 style='color: red'>Hello World</h1>";

  constructor(private modalService: NgbModal,
    private readonly _modalReference: ModalReference<Template>
  ) {
    this.sendRes = new EventEmitter();


    this.template = this._modalReference.config.model
    // console.log('template::: ', this.template);

    this.template.modulos.forEach(element => {
      this.css += element.css
      // console.log('  this.css ::: ', this.css);
      this.diseno += element.diseno
    });
    this.cssContent = this.css


  }
  ngAfterViewInit() {

  }


}
