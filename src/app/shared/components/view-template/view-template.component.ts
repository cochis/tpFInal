import { Component, Input, OnInit } from '@angular/core';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.css']
})
export class ViewTemplateComponent implements OnInit {
  @Input() data: any;
  today = this.functionsService.getToday()
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  date: number = this.today + 199456789
  constructor(private functionsService: FunctionsService) {
    
  }
  ngOnInit() {
 
    

  }
  restParty() {


    let i = 0
    const interval = setInterval((): void => {
      if (this.date > 0) {
        ++i

        let d = (this.date - this.functionsService.getToday()) / 86400000
        this.dias = Math.trunc(d)


        let hr = ((this.date - this.functionsService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)


        let min = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))

        this.minutos = Math.trunc(min / 60000)

        let seg = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))

        this.segundos = Math.trunc(seg / 1000)



      }
    }, 1000);

  }
}
