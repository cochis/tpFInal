import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-funcionalidades',
  templateUrl: './funcionalidades.component.html',
  styleUrls: ['./funcionalidades.component.scss']
})
export class FuncionalidadesComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    // 1. Título de la página (Importante para el CTR en SERPs)
    this.titleService.setTitle('Funcionalidades | Invitación Digital de Bautizo y Comunión - MyTiketParty');

    // 2. Meta Descripción (Descripción que aparece bajo el título en Google)
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre todas las funcionalidades de nuestra invitación digital religiosa: Boletos QR, Mapas, Lista de Regalos, RSVP y diseño angelical.'
    });

    // 3. Meta Keywords (Opcional, pero no hace daño)
    this.metaService.updateTag({
      name: 'keywords',
      content: 'invitación digital, bautizo, primera comunión, funcionalidades, boletos QR, RSVP, lista de regalos, diseño religioso'
    });
  }
}