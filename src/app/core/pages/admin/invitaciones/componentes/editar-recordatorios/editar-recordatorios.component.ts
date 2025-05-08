import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-editar-recordatorios',
  templateUrl: './editar-recordatorios.component.html',
  styleUrls: ['./editar-recordatorios.component.scss']
})
export class EditarRecordatoriosComponent implements AfterViewInit {
  @Input() data: any
  ngAfterViewInit() {


  }
}
