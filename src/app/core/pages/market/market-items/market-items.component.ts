import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';
import { CategoriaItemsService } from 'src/app/core/services/categoriaItem.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { CargarCategoriaItems } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
@Component({
  selector: 'app-market-items',
  templateUrl: './market-items.component.html',
  styleUrls: ['./market-items.component.scss']
})
export class MarketItemsComponent implements AfterViewInit {
  @Input() items: any;
  itemsTemp: any;
  public form!: FormGroup
  CP = environment.cPrimary
  CS = environment.cSecond
  @Input() cP: any = this.CP;
  @Input() cS: any = this.CS;
  CW = '#ffffff'
  p: any
  loading: boolean = false
  categoriaItems: CategoriaItem[]
  constructor(
    private categoriaItemsService: CategoriaItemsService,
    private functionsService: FunctionsService,
    private fb: FormBuilder,
  ) {

    this.createForm()
    this.getCatalogos()


  }
  ngAfterViewInit(): void {
    setTimeout(() => {

      this.itemsTemp = this.items



    }, 500);


  }
  createForm() {
    this.form = this.fb.group({
      filter: ['', [Validators.required]],
      valueSelect: [''],
      valueInput: [''],
      valueMin: [0],
      valueMax: [0],

    })
    setTimeout(() => {

      this.loading = false
    }, 500);
  }
  onSubmit() {


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
  filterValues(type, value) {

    this.items = this.itemsTemp




    var res
    switch (type) {
      case 'precios':
        var regex = /(\d+)/g;
        let min: any = this.form.value.valueMin

        let max: any = this.form.value.valueMax


        setTimeout(() => {

          if ((min !== 0) && (max !== 0) && (max > min)) {


            setTimeout(() => {

              this.items.forEach(it => {

                this.items = this.getPrecio(it).filter(it => {

                  return (it.precio >= min && it.precio < max)
                })

              });
            }, 1500);
            setTimeout(() => {
              this.loading = false
            }, 500);

          } else {
            return
          }

        }, 800);



        break;
      case 'nombre':
        setTimeout(() => {
          if (value.length >= 3) {
            this.loading = true
            value = value.toString().toLowerCase().trim()
            res = this.items.filter(res => {

              res.nombre = res.nombre.toString().toLowerCase().trim()
              return res.nombre.includes(value)
            })

          }
          else {
            this.items = this.itemsTemp
          }
        }, 500);
        break;
      case 'categorias':
        res = this.items.filter(res => {
          return res.categoriaItem._id == value
        })


        break;

      default:

        res = this.itemsTemp
        break;
    }
    setTimeout(() => {

      if (res.length == 0) {
        this.functionsService.alert('Productos y Servicios', 'No hay ningún resultado', 'info')
        this.items = this.itemsTemp

        this.loading = false
      } else {

        this.items = res
        this.loading = false
      }
    }, 1500);



  }


  getPrecio(item) {
    var precios


    if (item.isByCantidad) {

      precios = item.cantidades

    }
    if (item.isByColor) {

      precios = item.colores
    }
    if (item.isByService) {

      precios = item.servicios
    }
    if (item.isBySize) {


      precios = item.sizes
    }


    return precios
  }
}
