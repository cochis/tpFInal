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
  styleUrls: ['./galeria.component.scss']
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
  total = 0
  porcentaje = 100
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

    this.fiestaId = this.route.snapshot.params['fiesta']


    this.boletoId = this.route.snapshot.params['boleto']


    this.anfitrionId = this.route.snapshot.params['anfitrion']



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

      if (this.fiestaDB.fecha > this.today) {

        this.functionsService.alert('Evento', 'El evento aun no ha empezado', 'error')


        this.functionsService.navigateTo(`/core/mis-fiestas`)
      }

    },
      (err) => {
        console.error('Error', err)
        this.functionsService.alert('Evento', 'El evento no existe', 'error')
        this.functionsService.navigateTo("/core/inicio")
      }
    )


  }
  getFiesta() {
    this.fiestaService.cargarFiestaById(this.fiestaId).subscribe((resp) => {
      this.fiestaDB = resp.fiesta

      if (this.fiestaDB.fecha > this.today) {

        this.functionsService.alert('Evento', 'El evento aun no ha empezado', 'error')

        if (this.fiestaDB.invitacion.includes('default')) {

          this.functionsService.navigateTo(`/core/templates/default/${this.fiestaId}/${this.boletoId}`)
        } else if (this.fiestaDB.invitacion.includes('byFile')) {
          this.functionsService.navigateTo(`/core/templates/byFile/${this.fiestaId}/${this.boletoId}`)

        } else if (this.fiestaDB.invitacion.includes('fancy')) {
          this.functionsService.navigateTo(`/core/templates/fancy/${this.fiestaId}/${this.boletoId}`)

        }
      }

    },
      (err) => {
        console.error('Error', err)
        this.functionsService.alert('Evento', 'El evento no existe', 'error')
        this.functionsService.navigateTo("/core/inicio")
      }
    )
    this.boletoService.cargarBoletoById(this.boletoId).subscribe((resp) => {
      this.boletoDB = resp.boleto
      if (!this.boletoDB.activated) {
        this.functionsService.alert('Boleto', 'El boleto no existe', 'error')
        this.functionsService.navigateTo("/core/inicio")

      }

    },
      (err) => {
        console.error('Error', err)
        this.functionsService.alert('Boleto', 'El boleto no existe', 'error')
        this.functionsService.navigateTo("/core/inicio")
      })

  }


  getPictures() {

    if (!this.boletoId) {
      this.galeriaService.cargarGaleriaByFiesta(this.fiestaId).subscribe((resp) => {
        this.galerias = this.functionsService.getActives(resp.galerias)


      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Galerias')
        })
    } else {
      this.galeriaService.cargarGaleriaByBoleto(this.boletoId).subscribe((resp) => {
        this.galerias = this.functionsService.getActives(resp.galerias)

      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Galerias')
        })
    }

  }
  async upImages(file) {
    this.porcentaje = 100
    this.imagens = file.target.files
    if (this.imagens.length > 20) {
      this.loading = false
      this.functionsService.alert('Galeria', 'Máximo de archivos 20', 'info')
      return
    }
    this.totalImg = file.target.files.length
    this.total = 100 / this.totalImg
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
                  this.porcentaje = this.porcentaje - this.total
                  this.idx++
                  if (this.porcentaje == 0) {
                    this.getPictures()
                  }
                }
              )
          }, (error) => {
            console.error('Error', error)
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

    };
    processArray(myArray)
      .then(() => {
        this.loading = false
        this.getPictures()

      })
      .catch((error) => {
        console.error('An error occurred:', error);
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
  deleteOne(foto) {

    this.fileService.deleteFoto("galerias", foto.uid).subscribe(res => {

      this.getPictures()
      return true
    })

  }
  deleteAll(fiesta) {

    this.porcentaje = 100
    this.totalImg = this.galerias.length
    this.total = 100 / this.totalImg


    this.loading = true
    this.galerias.forEach(galeria => {
      setTimeout(() => {

        this.porcentaje = this.porcentaje - this.total

        this.deleteOne(galeria)
        if ((this.porcentaje - this.total) < 0) {
          this.loading = false
          this.getPictures()
        }
      }, 500);

    });

  }
}
