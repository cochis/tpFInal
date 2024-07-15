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


@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit, OnDestroy {
  obs1: Subscription;
  fiesta: string = ''
  boleto: string = ''
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
  today: Number = this.functionsService.getToday()
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private salonesService: SalonsService,
    private galeriaService: GaleriasService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private fiestaService: FiestasService,
    private readonly _modalService: ModalService
  ) {
    this.fiesta = this.route.snapshot.params['fiesta']
    this.boleto = this.route.snapshot.params['boleto']

    this.getFiesta()
  }
  ngOnInit(): void {

    this.getPictures()

    this.obs1 = this.src1.subscribe((value: any) => {
      this.getPictures()

    }
    )
  }

  getFiesta() {
    this.fiestaService.cargarFiestaById(this.fiesta).subscribe((resp) => {
      this.fiestaDB = resp.fiesta
      // console.log('   this.fiestaDB::: ', this.fiestaDB);

    })
  }


  getPictures() {


    // console.log('this.rol ::: ', this.rol);
    if (this.rol == this.ADM || this.rol == this.ANF || this.rol == this.SLN) {
      this.galeriaService.cargarGaleriaByFiesta(this.fiesta).subscribe((resp) => {
        this.galerias = resp.galerias
      })
    } else {
      this.galeriaService.cargarGaleriaByBoleto(this.boleto).subscribe((resp) => {
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
      fiesta: this.fiesta,
      boleto: this.boleto,
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
            // console.log('error::: ', error);
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
    // console.log('downloas');
    this.galeriaService.downloadGaleriaByFiesta(this.fiesta).subscribe((resp: any) => {
      // console.log('resp::: ', resp);
      if (resp.ok) {
        this.dw = true
        this.dwUrl = resp.url
      }

    })

  }
}
