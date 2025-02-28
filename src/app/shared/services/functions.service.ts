import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { SwPush } from '@angular/service-worker';
import * as SecureLS from 'secure-ls';
import { Parametro } from 'src/app/core/models/parametro.model';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  device_token: any
  ls = new SecureLS();
  textToHTML: SafeHtml;
  public readonly VAPID_PUBLICK_KEY = environment.publicKey
  constructor(
    private router: Router,
    private location: Location,
    private swPush: SwPush,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }
  getIp() {
    return this.http.get("https://geolocation-db.com/json/");
  }

  convertDes(des: string) {
    let spl = des.split('\n')
    var desc = '<ul style="list-style:none;    padding: 0;">'
    spl.forEach(element => {
      desc += `<li>${element}</li>`
    });
    desc += '</ul>'
    this.textToHTML = this.sanitizer.bypassSecurityTrustHtml(desc)

    return this.textToHTML
  }
  back() {
    this.location.back();
  }
  navigateTo(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true })
  }
  getToday() {
    return Date.now()
  }
  getLocal(name: string) {
    return this.ls.get(name)
  }
  setLocal(name: string, value: any) {
    this.ls.set(name, value)
  }
  clearLocal() {


    this.ls.remove('email')
    this.ls.remove('role')
    this.ls.remove('token')
    this.ls.remove('uid')

  }
  removeItemLocal(name: string) {
    localStorage.removeItem(name)
  }
  getValueCatalog(id: string, filter: string, catalogo: any) {

    if (id && catalogo) {
      let ret = catalogo.filter((cat: any) => {
        return cat.uid === id
      })
      if (ret[0][filter]) {
        return ret[0][filter]
      }
    } else {
      return ''
    }
  }
  getTypeValueCatalog(id: string, filter: string, catalogo: any, returnV: string) {

    if (id && catalogo) {
      let ret = catalogo.filter((cat: any) => {
        return cat[filter] === id
      })
      if (ret[0][filter]) {
        return ret[0][returnV]
      }
    } else {
      return ''
    }
  }
  getActives(obj: any) {
    let ret = obj.filter((item: any) => {
      return item.activated === true
    })
    return ret
  }
  sendMessage(tipo: string, header: string, message: string,) {
    let mes = {
      tipo,
      header,
      message
    }
    return mes
  }
  numberDateTimeLocal(date) {
    let today = new Date(date)
    var m = today.getMonth() + 1
    var monthT = m.toString()
    var d = today.getDate()
    var dayT = today.getDate().toString()
    let dt
    if (d < 10) {
      dayT = '0' + d
    }
    if (m < 10) {
      monthT = '0' + m
    }
    var hr = today.getHours()
    var hrT = ''
    if (Number(hr) <= 9) {
      hrT = '0' + hr
    } else {
      hrT = hr.toString()
    }
    var min = today.getMinutes()
    var minT = ''
    if (Number(min) <= 9) {
      minT = '0' + min
    } else {
      minT = min.toString()
    }
    dt = today.getFullYear() + '-' + monthT + '-' + dayT + 'T' + hrT + ':' + minT
    return dt
  }
  numberToDate(date) {
    let today = new Date(date)
    var m = today.getMonth() + 1
    var monthT = m.toString()
    var d = today.getDate()
    var dayT = today.getDate().toString()
    let dt
    if (d < 10) {
      dayT = '0' + d
    }
    if (m < 10) {
      monthT = '0' + m
    }
    dt = today.getFullYear() + '-' + monthT + '-' + dayT
    return dt
  }
  datePush(date) {
    let today = new Date(date)
    var m = today.getMonth() + 1
    var monthT = m.toString()
    var d = today.getDate()
    var dayT = today.getDate().toString()
    let dt
    if (d < 10) {
      dayT = '0' + d
    }
    if (m < 10) {
      monthT = '0' + m
    }
    dt = + dayT + '-' + monthT + '-' + today.getFullYear()
    return dt
  }
  dateToNumber(date) {
    return new Date(date).getTime()
  }
  alert(title: string, message: string, type: any) {
    Swal.fire({
      title: title, text: message, icon: type, confirmButtonColor: environment.cPrimary,
      showConfirmButton: false, timer: 1500, timerProgressBar: true
    })
  }
  alertUpdate(tipo: string) {
    Swal.fire({
      title: tipo, text: 'Información actualizada', icon: 'success', confirmButtonColor: environment.cPrimary,
      showConfirmButton: false, timer: 1500, timerProgressBar: true
    })
  }
  alertError(data: object, tipo: string) {
    Swal.fire({
      title: tipo, text: 'Algo extraño paso intente mas tarde', icon: 'error', confirmButtonColor: environment.cPrimary,
      showConfirmButton: false, timer: 1500, timerProgressBar: true
    })
  }
  alertForm(type: string) {
    Swal.fire({
      title: type, text: 'Favor llenar todos los campos', icon: 'info', confirmButtonColor: environment.cPrimary,
      showConfirmButton: false, timer: 1500, timerProgressBar: true
    })
  }
  errorInfo() {
    Swal.fire({
      title: 'Info', text: 'Error al cargar la información', icon: 'error', confirmButtonColor: environment.cPrimary,
      showConfirmButton: false, timer: 1500, timerProgressBar: true
    })
  }
  alertColor(obj: any) {
    Swal.fire({
      title: obj.title,
      showDenyButton: obj.colorDeny ? true : false,
      showCancelButton: obj.colorCancel ? true : false,
      confirmButtonText: obj.colorConfirmText,
      denyButtonText: obj.colorDenyText ? obj.colorDenyText : undefined,
      confirmButtonColor: obj.colorConf,
      cancelButtonColor: obj.colorConf ? obj.colorConf : undefined,
      showConfirmButton: false, timer: 1500, timerProgressBar: true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire(obj.colorConfirmText, "", "success");
      } else if (result.isDenied) {
        Swal.fire("Cancelado", "", "info");
      }
    });
  }
  isAdmin() {
    const ADM = environment.admin_role
    const rol = this.getLocal('role')
    if (rol == ADM) {
      return true
    } else {
      return false
    }
  }
  getActivos(array: any) {
    let x = array.filter((a) => {
      if (a.activated) {
        return a
      }
    })
    return x
  }
  getNoActivos(array: any) {
    let x = array.filter((a) => {
      if (!a.activated) {
        return a
      }
    })
    return x
  }
  getFinished(array: any) {
    let x = array.filter((a) => {
      if (a.fecha < this.getToday()) {
        return a
      }
    })
    return x
  }
  getTD(array: any) {
    let x = array.filter((a) => {
      if (a.fecha > (this.getToday() - 86400000) && a.fecha < (this.getToday() + 86400000)) {
        return a
      }
    })
    return x
  }
  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/auth/login')
  }
  subscribeToPush(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.swPush.isEnabled) {
        let sub = await this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLICK_KEY
        })
        if (sub) {
          this.device_token = sub;
          this.setLocal('tokenPush', JSON.stringify(this.device_token))
          if (sub) {
            resolve(this.device_token);
          } else {
            reject({ message: "Error getting device id" });
          }
        } else {
          reject({ message: "Error getting device id" });
        }
      } else {
        reject({ message: "Error getting device id" });
      }
    })
  }
  filterBy(search: string, arreglo: any): any {
    var res: any = []
    var result
    arreglo.forEach(async item => {
      let valores: any = Object.values(item)
      for (let i = 0; i < valores.length; i++) {
        if (valores[i] !== undefined && valores[i] !== null) {
          if (typeof (valores[i]) == 'number') {
            valores[i] = valores[i].toString().toLowerCase()
          }
          if (typeof (valores[i]) == 'object' || typeof (valores[i]) == 'boolean') {
            valores[i] = JSON.stringify(valores[i]).toLowerCase()
          }
          valores[i] = valores[i].toLowerCase()
          if (valores[i].includes(search)) {
            res.push(item)
          }
        }
      }
      result = res.filter((item, index) => {
        return res.indexOf(item) === index;
      })
    });
    return result
  }
  getParametro(parametro: Parametro) {
    switch (parametro.type) {
      case 'string':
        return parametro.value
        break;
      case 'number':
        return Number(parametro.value)
        break;
      case 'boolean':
        if (parametro.value == 'true') {
          return true
        } else {
          return false
        }
        break;
      case 'number':
        return JSON.parse(parametro.value)
        break;
    }
  }


  async getBase64Image(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }


  scroolTo(id) {

    var div = document.getElementById(id);
    div.scrollIntoView();
  }


  scrollToTop() {


    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
