import { AfterViewInit, Component, Input } from '@angular/core';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-print-qr',
  templateUrl: './print-qr.component.html',
  styleUrls: ['./print-qr.component.css']
})
export class PrintQrComponent implements AfterViewInit {
  @Input() proveedor: any
  url = environment.base_url
  text_url = environment.text_url
  urlLink = ''
  link = ''

  constructor(
    private printService: NgxPrintService
  ) {

  }
  ngAfterViewInit() {


  }
  hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');

      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.3)';
    }
    throw new Error('Bad Hex');
  }

  printMe() {



    this.urlLink = this.text_url + 'core/vista-proveedor/' + this.proveedor.uid


    setTimeout(() => {
      const customPrintOptions: PrintOptions = new PrintOptions({

        printSectionId: 'print-section',
        // Add any other print options as needed
      });
      customPrintOptions.useExistingCss = true
      customPrintOptions.printTitle = this.proveedor.nombre
      customPrintOptions.previewOnly = true





      this.printService.print(customPrintOptions)
    }, 500);
  }

}
