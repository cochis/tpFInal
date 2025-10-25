import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { CpsService } from 'src/app/core/services/cp.service';
import { Cp } from 'src/app/core/models/cp.model';
import { CargarCps, CargarPaises } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import * as XLSX from 'xlsx'
import { Pais } from 'src/app/core/models/pais.model';
import { PaisesService } from 'src/app/core/services/pais.service';

@Component({
  selector: 'app-vista-cps',
  templateUrl: './vista-cps.component.html',
  styleUrls: ['./vista-cps.component.scss']
})
export class VistaCpsComponent {
  data!: any
  cps: Cp[]
  cpsTemp: Cp[]
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  today: Number = this.functionsService.getToday()
  paises: Pais[]
  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,
    private paisesService: PaisesService,
    private cpsService: CpsService
  ) {
    this.getCatalogos()
    this.getCps()

  }

  buscar(termino) {
    if (termino.length == 5) {

      termino = termino.toLowerCase()
      if (termino.length < 0) {
        this.cps = this.cpsTemp
        return
      }
      termino = termino.trim().toLowerCase()
      setTimeout(() => {
        this.functionsService.filterBy(termino, this.cpsTemp)

        this.cpsService.cargarCpByCP(termino).subscribe(resp => {

          this.cps = resp.cps
        })


      }, 500);
    } else {
      this.cps = this.cpsTemp
      return
    }
  }




  setCps() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getCps() {
    this.loading = true




    if (this.rol === this.ADM) {
      this.cpsService.cargarCpsByPaisEdo('MX', 'Aguascalientes').subscribe((resp: CargarCps) => {


        this.cps = resp.cps


        this.cpsTemp = resp.cps
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Cps')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.cpsService.cargarCpsByEmail(usr).subscribe((resp: CargarCps) => {

        this.cps = resp.cps
        this.cpsTemp = resp.cps
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editCp(id: string) {

    this.functionsService.navigateTo(`/cps/editar-cp/true/${id}`)

  }
  isActived(cp: Cp) {

    this.cpsService.isActivedCp(cp).subscribe((resp: any) => {
      this.getCps()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Cps')

      })
  }
  viewCp(id: string) {
    this.functionsService.navigateTo(`/cps/editar-cp/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }

  cargarCps(pais, edo) {
    if (pais !== '' && edo !== '') {
      this.cps = []
      this.cpsService.cargarCpsByPaisEdo(pais, edo).subscribe(resp => {
        this.cps = resp.cps
      })
    } else {
      this.functionsService.alertError([], 'LLena los campos completos')
    }

  }
  async cargaCps(ev) {
    this.loading = true
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = async (event) => {

      const data = reader.result;

      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.cpsService.deleteCPS().subscribe(async (res: any) => {

        if (res.ok) {
          jsonData.Nota = undefined
          jsonData = [jsonData]
          let cp = await this.validarCpsFile(jsonData)
          await this.crearCpFile(cp)
          this.getCps()
          this.loading = false
        }
      }, (error) => {
        console.error('error::: ', error);

      })







    }
    reader.readAsBinaryString(file);
  }

  async deleteCPS() {

  }


  async validarCpsFile(data = []) {
    var cps = []
    var cp = null
    let clvs = Object.keys(data[0]); // claves = ["nombre", "color", "macho", "edad"]
    clvs.forEach(element => {

      if (data[0][element] != undefined) {

        data[0][element].forEach(el => {
          cp = {

            d_codigo: el.d_codigo,
            d_asenta: el.d_asenta,
            d_tipo_asenta: el.d_tipo_asenta,
            D_mnpio: el.D_mnpio,
            d_estado: el.d_estado,
            d_ciudad: el.d_ciudad,
            d_CP: el.d_CP,
            c_estado: el.c_estado,
            c_oficina: el.c_oficina,
            c_CP: el.c_CP,
            c_tipo_asenta: el.c_tipo_asenta,
            c_mnpio: el.c_mnpio,
            id_asenta_cpcons: el.id_asenta_cpcons,
            d_zona: el.d_zona,
            c_cve_ciudad: el.c_cve_ciudad,
            usuarioCreated: this.uid,
            activated: true,
            dateCreated: this.today,
            lastEdited: this.today,

          }
          cps.push(cp)
        });
      }

    });

    return await cps

  }
  async crearCpFile(data) {

    var cps = []
    var cp = null

    return await data.forEach(async c => {

      this.cpsService.crearCp(c).subscribe(async res => {

        return await res

      }, (error) => {
        console.error('error::: ', error);

      })

    });


  }
  getCatalogos() {
    this.loading = true

    this.paisesService.cargarPaisesAll().subscribe((resp: CargarPaises) => {
      this.paises = resp.paises

      this.loading = false
    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Centro de eventos (Países)')
        this.loading = false
      })



  }

}
