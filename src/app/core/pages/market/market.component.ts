import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { FunctionsService } from '../../../shared/services/functions.service';
import { CategoriaItemsService } from '../../services/categoriaItem.service';
import { CategoriaItem } from '../../models/categoriaItem.model';
import { CargarCategoriaItems } from '../../interfaces/cargar-interfaces.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, AfterViewInit {
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
    private meta: Meta,
    private titleService: Title
  ) {

    /* 
        let t: string = 'Productos y Servicios para Eventos | Mobiliario, Catering, Decoración y Más | MyTicketParty';
        this.title.setTitle(t);
    
        this.metaService.generateTags({
          title: 'Productos y Servicios para Eventos | Mobiliario, Catering, Decoración y Más | MyTicketParty',
          description:
            'Descubre el marketplace líder en productos y servicios para eventos: decoración, catering, mobiliario, entretenimiento y más. ¡Organiza tu evento perfecto hoy!',
          keywords:
            'productos para eventos, servicios para eventos, catering, renta de sillas, mobiliario, decoración, sonido, iluminación, logística de eventos, MyTicketParty',
          slug: 'core/market',
          colorBar: '#13547a',
          image:
            window.location.origin + '/assets/images/qr.svg',
        }); */


    this.getItems()
    this.createForm()
    this.getCatalogos()
  }

  ngOnInit(): void {
    const titulo = 'Productos y Servicios para Eventos | Mobiliario, Catering, Decoración y Más | MyTicketParty';
    const descripcion = 'Descubre el marketplace líder en productos y servicios para eventos: decoración, catering, mobiliario, entretenimiento y más. ¡Organiza tu evento perfecto hoy!';

    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/market' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
      { name: 'slug', content: 'core/market' },
      { name: 'colorBar', content: '#13547a' },
    ]);
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
