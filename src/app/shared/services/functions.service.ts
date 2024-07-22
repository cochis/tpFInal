import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  device_token: any
  public readonly VAPID_PUBLICK_KEY = environment.publicKey
  constructor(
    private router: Router,
    private swPush: SwPush,
  ) { }



  navigateTo(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true })
  }

  getToday() {
    return Date.now()
  }

  getLocal(name: string) {
    return localStorage.getItem(name)
  }
  setLocal(name: string, value: any) {


    switch (typeof (value)) {
      case 'object':
        localStorage.setItem(name, JSON.stringify(value))
        break;
      case 'boolean':
        localStorage.setItem(name, JSON.stringify(value))
        break;

      default:
        localStorage.setItem(name, value)
        break;
    }

  }

  clearLocal() {
    localStorage.clear();
  }
  removeItemLocal(name: string) {
    localStorage.removeItem(name)
  }



  getValueCatalog(id: string, filter: string, catalogo: any) {

    if (id && catalogo) {
      let ret = catalogo.filter((cat: any) => {
        return cat.uid === id
      })
      return ret[0][filter]
    } else {
      return 'UNDEFINED '
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
    Swal.fire({ title: title, text: message, icon: type, confirmButtonColor: "#13547a" })
  }
  alertUpdate(tipo: string) {
    Swal.fire({ title: tipo, text: 'Información actualizada', icon: 'success', confirmButtonColor: "#13547a" })
  }
  alertError(data: object, tipo: string) {
    //console.log('data::: ', data);

    Swal.fire({ title: tipo, text: 'Algo extraño paso intente mas tarde', icon: 'error', confirmButtonColor: "#13547a" })
  }
  alertForm(type: string) {

    Swal.fire({ title: type, text: 'Favor llenar todos los campos', icon: 'info', confirmButtonColor: "#13547a" })
  }
  errorInfo() {

    Swal.fire({ title: 'Info', text: 'Error al cargar la información', icon: 'error', confirmButtonColor: "#13547a" })
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


  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/auth/login')

  }
  subscribeToPush(): Promise<any> {
    //console.log('getting device token')
    return new Promise(async (resolve, reject) => {
      if (this.swPush.isEnabled) {
        //console.log('before subscription')
        let sub = await this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLICK_KEY
        })
        //console.log('temp --------', sub)
        if (sub) {
          this.device_token = sub;
          this.setLocal('tokenPush', JSON.stringify(this.device_token))
          //console.log('this.device_token ::: ', this.device_token);
          if (sub) {
            //console.log('if sub')
            resolve(this.device_token);
          } else {
            //console.log('else sub')
            reject({ message: "Error getting device id" });
          }
        } else {
          reject({ message: "Error getting device id" });
        }
      } else {
        //console.log('sw is not enabled');
        reject({ message: "Error getting device id" });
      }
    })
  }
}
