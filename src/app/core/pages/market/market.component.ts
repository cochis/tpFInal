import { AfterViewInit, Component } from '@angular/core';
import { ItemsService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { FunctionsService } from '../../../shared/services/functions.service';
import { CategoriaItemsService } from '../../services/categoriaItem.service';
import { CategoriaItem } from '../../models/categoriaItem.model';
import { CargarCategoriaItems } from '../../interfaces/cargar-interfaces.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements AfterViewInit {
  public form!: FormGroup

  items: Item[] = []
  categoriaItems: CategoriaItem[]
  loading: boolean = false

  constructor(
    private itemsService: ItemsService,
    private categoriaItemsService: CategoriaItemsService,
    private functionsService: FunctionsService,
    private metaService: MetaService,
    private title: Title,
    private fb: FormBuilder,
  ) {


    let t: string = 'Productos y Servicios para Eventos | Mobiliario, Catering, Decoración y Más | MyTicketParty';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'Productos y Servicios para Eventos | Mobiliario, Catering, Decoración y Más | MyTicketParty',
      description:
        'Explora productos y servicios para tu evento: renta de mobiliario, catering, decoración, iluminación, sonido y mucho más. ¡Todo en un solo sitio!',
      keywords:
        'productos para eventos, servicios para eventos, catering, renta de sillas, mobiliario, decoración, sonido, iluminación, logística de eventos, MyTicketParty',
      slug: 'core/market',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.svg',
    });


    this.getItems()
    this.createForm()
    this.getCatalogos()
  }
  ngAfterViewInit() {

  }
  createForm() {
    this.form = this.fb.group({
      filter: ['', [Validators.required]],
      valueSelect: [''],
      valueInput: [''],
      valueMin: [''],
      valueMax: [''],

    })

  }
  onSubmit() {


  }
  getItems() {
    this.itemsService.cargarItemsAll().subscribe(res => {
      this.items = this.functionsService.getActivos(res.items)


    })
  }

  getCatalogos() {
    this.loading = true

    this.categoriaItemsService.cargarCategoriaItemsAll().subscribe((resp: CargarCategoriaItems) => {
      this.categoriaItems = resp.categoriaItems


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Perfil')
        this.loading = false
      })


  }
  orderBy(value) {

    switch (value.target.value) {
      case 'categoria':



      default:
        break;
    }

  }
}
