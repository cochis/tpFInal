import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { FunctionsService } from '../../../shared/services/functions.service';
import { CategoriaItemsService } from '../../services/categoriaItem.service';
import { CategoriaItem } from '../../models/categoriaItem.model';
import { CargarCategoriaItems } from '../../interfaces/cargar-interfaces.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, AfterViewInit {
  public form!: FormGroup

  items: Item[] = []
  itemsTemp: Item[] = []
  categoriaItems: CategoriaItem[]
  loading: boolean = false

  constructor(
    private itemsService: ItemsService,
    private categoriaItemsService: CategoriaItemsService,
    private functionsService: FunctionsService,
    private fb: FormBuilder,
    private meta: Meta,
    private titleService: Title
  ) {




    this.getItems()
    this.createForm()
    this.getCatalogos()
  }

  ngOnInit(): void {
    const titulo = 'Productos y Servicios para Eventos | Mobiliario, Catering, Decoración y Más | MyTicketParty';
    const descripcion = 'Descubre el marketplace líder en productos y servicios para eventos: decoración, catering, mobiliario, entretenimiento y más. ¡Organiza tu evento perfecto hoy!,';
    this.functionsService.removeTags()
    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/market' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
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
      this.itemsTemp = this.items



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

  filterBY(cat: any) {

    if (cat !== '') {
      this.items = this.itemsTemp
      this.items = this.items.filter((it: any) => {

        return it.categoriaItem._id == cat
      })
    } else {
      this.items = this.itemsTemp
    }

  }
  orderBy(value) {

    switch (value) {
      case 'menor':

        this.items = [...this.items].sort((a: any, b: any) => a.precio - b.precio);


        break;
      case 'mayor':
        this.items = [...this.items].sort((a: any, b: any) => b.precio - a.precio);


        break;

      default:
        break;
    }

  }
}
