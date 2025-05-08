import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FixMeLater } from 'angularx-qrcode';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements AfterViewInit, OnInit {

  @Input() qr: any;
  url = environment.base_url
  text_url = environment.text_url
  obj: any = undefined
  urlLink = ''
  loading = false
  constructor() {
    this.loading = true

  }
  ngOnInit() {




  }

  ngAfterViewInit(): void {

    this.obj = JSON.parse(this.qr)

    this.urlLink = JSON.stringify(this.text_url + 'core/vista-proveedor/' + this.obj.uid)


    setTimeout(() => {
      this.loading = false
    }, 1500);



  }



}
