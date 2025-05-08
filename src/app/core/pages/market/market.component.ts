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


    let t: string = 'My Ticket Party | Marketplace';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'My Ticket Party | Marketplace',
      description:
        'Marketplace , Un marketplace de servicios y productos para eventos es una plataforma en línea que conecta a organizadores de eventos con proveedores de diversos servicios y productos necesarios para llevar a cabo una celebración exitosa.',
      keywords:
        'Myticketparty, Marketplace, Eventos, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, conjunto musicales, insumos, recuerdos, arreglos florales, comida ',
      slug: 'core/market',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.jpeg',
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
