import { AfterViewInit, Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr-desing',
  templateUrl: './qr-desing.component.html',
  styleUrls: ['./qr-desing.component.scss']
})
export class QrDesingComponent implements AfterViewInit {
  @Input() data: any
  @Input() bgsframes: any
  @Input() boleto: any = undefined
  @Input() fiesta: any = undefined
  loading = true
  viewCroquis = false
  url = environment.base_url
  public qrCodeDownloadLink: SafeUrl = "";
  ngAfterViewInit() {
    this.bgsframes
    this.data




    setTimeout(() => {
      this.loading = false
    }, 500);

  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  getQr(boleto) {

    var qr: any = {

      uid: boleto.uid,
      fiesta: boleto.fiesta,
      grupo: boleto.grupo,
      salon: boleto.salon,

      activated: boleto.activated
    }
    qr = JSON.stringify(qr)



    return qr

  }

  verCroquis() {

    this.viewCroquis = !this.viewCroquis

    if (this.viewCroquis) {
      document.getElementById('croquis').classList.remove('animate__fadeIn');
    } else {

      document.getElementById('croquis').classList.remove('animate__fadeOut');
    }





  }
  getImg(img) {

    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
