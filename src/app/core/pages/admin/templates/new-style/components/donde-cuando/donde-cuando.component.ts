import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-donde-cuando',
  templateUrl: './donde-cuando.component.html',
  styleUrls: ['./donde-cuando.component.css']
})
export class DondeCuandoComponent implements AfterViewInit {
  @Input() data: any
  @Input() bgsframes: any
  url = environment.base_url
  lugares: any = []
  ngAfterViewInit() {



    let donde1 = {
      dondeAddress: this.data.donde1Address,
      dondeAddressUbicacion: this.data.donde1AddressUbicacion,
      dondeAddressUbicacionLat: this.data.donde1AddressUbicacionLat,
      dondeAddressUbicacionLng: this.data.donde1AddressUbicacionLng,
      dondeCheck: this.data.donde1Check,
      dondeDate: this.data.donde1Date,
      dondeIcon: this.data.donde1Icon,
      dondeImg: this.data.donde1Img,
      dondeText: this.data.donde1Text,
      dondeTitle: this.data.donde1Title
    }

    if (this.data.donde1Check == 'true' || this.data.donde1Check == true) {
      this.lugares.push(donde1)
    }
    let donde2 = {
      dondeAddress: this.data.donde2Address,
      dondeAddressUbicacion: this.data.donde2AddressUbicacion,
      dondeAddressUbicacionLat: this.data.donde2AddressUbicacionLat,
      dondeAddressUbicacionLng: this.data.donde2AddressUbicacionLng,
      dondeCheck: this.data.donde2Check,
      dondeDate: this.data.donde2Date,
      dondeIcon: this.data.donde2Icon,
      dondeImg: this.data.donde2Img,
      dondeText: this.data.donde2Text,
      dondeTitle: this.data.donde2Title
    }

    if (this.data.donde2Check == 'true' || this.data.donde2Check == true) {
      this.lugares.push(donde2)
    }
    let donde3 = {
      dondeAddress: this.data.donde3Address,
      dondeAddressUbicacion: this.data.donde3AddressUbicacion,
      dondeAddressUbicacionLat: this.data.donde3AddressUbicacionLat,
      dondeAddressUbicacionLng: this.data.donde3AddressUbicacionLng,
      dondeCheck: this.data.donde3Check,
      dondeDate: this.data.donde3Date,
      dondeIcon: this.data.donde3Icon,
      dondeImg: this.data.donde3Img,
      dondeText: this.data.donde3Text,
      dondeTitle: this.data.donde3Title
    }

    if (this.data.donde3Check == 'true' || this.data.donde3Check == true) {
      this.lugares.push(donde3)
    }




  }

  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
