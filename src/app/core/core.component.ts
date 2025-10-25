import { Component, OnInit } from '@angular/core';
import { TraductorService } from './services/traductor.service';
import { Router } from '@angular/router';
import { FunctionsService } from '../shared/services/functions.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

  rutaActual: string;
  show = false

  // 2. Inyectar en el constructor
  constructor(private functionsService: FunctionsService,

    private router: Router
  ) {
    if (this.router.url == '/') {

      this.functionsService.navigateTo('home')
    }
    // 3. Acceder a la propiedad
  }

  ngOnInit(): void {
    console.log('La ruta actual es:', this.rutaActual);
    // Ejemplo de salida: /core/mis-fiestas
  }
}
