import { Component, OnDestroy, OnInit } from '@angular/core';
import { CargarSalons } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { Salon } from 'src/app/core/models/salon.model';
import { environment } from 'src/environments/environment';
import { FileService } from '../../services/file.service';
import { ActivatedRoute } from '@angular/router';
import { Galeria } from '../../models/galeria.model';
import { GaleriasService } from '../../services/galeria.service';
import { Subscription, interval } from 'rxjs';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { ModalComponent } from 'src/app/shared/components/modals/modal/modal.component';
import { Fiesta } from '../../models/fiesta.model';
import { FiestasService } from '../../services/fiestas.service';
import { BoletosService } from '../../services/boleto.service';
import { Boleto } from '../../models/boleto.model';


@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit, OnDestroy {
  obs1: Subscription;
  fiestaId: string = ''
  boletoId: string = ''
  anfitrionId: string = ''
  boletoDB: Boleto
  rol = this.functionsService.getLocal('role')
  totalImg = 0
  idx = 0
  dw = false
  dwUrl = ''
  data!: any
  galeria: Galeria
  galerias: Galeria[] = [];
  galeriasTemp: Galeria[] = [];
  loading = false
  url = environment.base_url
  public imagens: any
  public imagenSubir!: File
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  CHK = environment.chk_role
  ANF = environment.anf_role
  ver = environment.version
  fiestaDB: Fiesta
  t = 100000
  src1 = interval(5000);
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  today = this.functionsService.getToday()
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private salonesService: SalonsService,
    private galeriaService: GaleriasService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private fiestaService: FiestasService,
    private boletoService: BoletosService,
    private readonly _modalService: ModalService
  ) {

    /* http://localhost:4200/core/galeria/669ab9e4396781c9f78cf4e7/669aa51f6497620d8bc20259 */
    this.fiestaId = this.route.snapshot.params['fiesta']
    this.boletoId = this.route.snapshot.params['boleto']
    this.anfitrionId = this.route.snapshot.params['anfitrion']
    console.log('this.anfitrionId', this.anfitrionId)
    console.log('this.uid', this.uid)
    if (!this.boletoId) {
      this.getFiestaByAnf(this.anfitrionId)
    } else {

      this.getFiesta()
    }
  }
  ngOnInit(): void {

    this.getPictures()



    this.obs1 = this.src1.subscribe((value: any) => {
      this.getPictures()

    }
    )
  }
  getFiestaByAnf(anf: string) {
    this.fiestaService.cargarFiestaById(this.fiestaId).subscribe((resp) => {
      this.fiestaDB = resp.fiesta
      console.log('this.fiestaDB ::: ', this.fiestaDB);
      if (this.fiestaDB.fecha > this.today) {

        this.functionsService.alert('Fiesta', 'La fiesta aun no ha empezado', 'error')


        this.functionsService.navigateTo(`/core/mis-fiestas`)
      }

    },
      (err) => {
        this.functionsService.alert('Fiesta', 'La fiesta no existe', 'error')
        this.functionsService.navigateTo('/')
      }
    )


  }
  getFiesta() {
    this.fiestaService.cargarFiestaById(this.fiestaId).subscribe((resp) => {
      this.fiestaDB = resp.fiesta
      console.log('this.fiestaDB::: ', this.fiestaDB);
      if (this.fiestaDB.fecha > this.today) {

        this.functionsService.alert('Fiesta', 'La fiesta aun no ha empezado', 'error')

        if (this.fiestaDB.invitacion.includes('default')) {

          this.functionsService.navigateTo(`/core/templates/default/${this.fiestaId}/${this.boletoId}`)
        } else {
          this.functionsService.navigateTo(`/core/invitaciones/xv/xv2/${this.fiestaId}/${this.boletoId}`)

        }
      }

    },
      (err) => {
        this.functionsService.alert('Fiesta', 'La fiesta no existe', 'error')
        this.functionsService.navigateTo('/')
      }
    )
    this.boletoService.cargarBoletoById(this.boletoId).subscribe((resp) => {
      this.boletoDB = resp.boleto
      if (!this.boletoDB.activated) {
        this.functionsService.alert('Boleto', 'El boleto no existe', 'error')
        this.functionsService.navigateTo('/')

      }

    },
      (err) => {
        this.functionsService.alert('Boleto', 'El boleto no existe', 'error')
        this.functionsService.navigateTo('/')
      })

  }


  getPictures() {

    if (!this.boletoId) {
      this.galeriaService.cargarGaleriaByFiesta(this.fiestaId).subscribe((resp) => {
        this.galerias = resp.galerias
      })
    } else {
      this.galeriaService.cargarGaleriaByBoleto(this.boletoId).subscribe((resp) => {
        this.galerias = resp.galerias
      })
    }
    // console.log('this.galerias ::: ', this.galerias);
  }
  async upImages(file) {
    this.imagens = file.target.files
    this.totalImg = file.target.files.length
    this.idx = 1
    let galeria: any = {
      fiesta: this.fiestaId,
      boleto: this.boletoId,
      img: null,
      activated: true,
      dateCreated: this.today,
      lastEdited: this.today,
    }
    const myArray = this.imagens;
    const performAsyncTask = async (item) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.galeriaService.crearGaleria(galeria).subscribe(async resp => {
            await this.fileService
              .actualizarFoto(item, 'galerias', resp.galeria.uid)
              .then(
                async (img) => {
                  this.idx++
                }
              )
          }, (error) => {
            console.log('error::: ', error);
          })
          resolve();
        }, 500);
      });
    };
    const processArray = async (array) => {
      for (const item of array) {
        this.loading = true
        await performAsyncTask(item);
      }
      // console.log('Imagenes procesadas');
    };
    processArray(myArray)
      .then(() => {
        this.loading = false
        this.getPictures()
        // console.log('Processing completed');
      })
      .catch((error) => {
        // console.error('An error occurred:', error);
      });



  }
  ngOnDestroy(): void {

    if (this.obs1) this.obs1.unsubscribe();

  }
  showPicture(img) {
    this._modalService.show<Galeria>(ModalComponent, {
      title: 'Ver Foto',
      size: 1,
      model: img,
      mode: 'fullScreen'
    })

  }
  download() {

    this.galeriaService.downloadGaleriaByFiesta(this.fiestaId).subscribe((resp: any) => {
      if (resp.ok) {
        this.dw = true
        this.dwUrl = resp.url
      }

    })

  }
  deleteOne(foto){
    console.log('foto', foto)
    console.log('foto', foto.uid)
    this.fileService.deleteFoto("galerias",foto.uid).subscribe(res=>{
      console.log('res', res)

    })

  }
  deleteAll(fiesta){
    console.log('fiesta', fiesta)

  }
}
