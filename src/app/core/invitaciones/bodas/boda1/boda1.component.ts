import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-boda1',
  templateUrl: './boda1.component.html',
  styleUrls: ['./boda1.component.scss']
})
export class Boda1Component {
  formActive: Boolean = false
  today = this.funtionService.getToday()
  tamanoDispositivo = 1024
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  bgX = 50
  bgY = 50
  date: number = this.today + 123456789
  res: number
  formCheck: boolean = false
  form: FormGroup = this.fb.group({

    tamano: [1024],
    checkForm: [true],
    imgInit: [''],
    bgPositionX: [50],
    bgPositionY: [50],
    esposo: ['Oscar'],
    esposa: ['Vianney'],
    evento: ['Nuestra boda'],
    fecha: [this.date],
    mensaje: ['Hoy empieza la mejor historia de nuestra vida'],
    checkIglesia: [true],
    titleIglesia: ['Ceremonia Religiosa'],
    nombreIglesia: ['Basilica de Guadalupe'],
    direccionIglesia: ['Fray Juan de Zumárraga No. 2, Villa Gustavo A. Madero, Gustavo A. Madero, 07050 Ciudad de México, CDMX'],
    fechaIglesia: [this.today + 456789],
    checkCivil: [true],
    titleCivil: ['Ceremonia Civil'],
    nombreCivil: ['Jusgado 5to familiar'],
    direccionCivil: ['Fray Juan de Zumárraga No. 2, Villa Gustavo A. Madero, Gustavo A. Madero, 07050 Ciudad de México, CDMX'],
    fechaCivil: [this.today + 456789],
    checkRecepccion: [true],
    nombreRecepccion: [''],
    direccionRecepccion: [''],
    fechaRecepccion: [''],
    checkHospedaje: [true]


  });
  constructor(private funtionService: FunctionsService,
    private readonly fb: FormBuilder,) {

    this.restParty()
  }

  getDate(date) {

    this.date = new Date(date).getTime()

  }
  submit() {

  
  }

  changeValue(type: string, value: any) {
    switch (type) {
      case 'bgPositionX':
        this.bgX = value
        break;
      case 'bgPositionY':
        this.bgY = value
        break;


    }
 

  }
  restParty() {


    let i = 0
    const interval = setInterval((): void => {
      if (this.date > 0) {
        ++i

        let d = (this.date - this.funtionService.getToday()) / 86400000
        this.dias = Math.trunc(d)


        let hr = ((this.date - this.funtionService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)


        let min = (this.date - this.funtionService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))

        this.minutos = Math.trunc(min / 60000)

        let seg = (this.date - this.funtionService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))

        this.segundos = Math.trunc(seg / 1000)



      }
    }, 1000);

  }

  changeDispositivo(tamano) {
  
    this.tamanoDispositivo = Number(tamano)
  

  }
}
