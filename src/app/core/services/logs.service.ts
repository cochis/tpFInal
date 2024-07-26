import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarLogs, CargarLog } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Log } from 'src/app/core/models/log.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private http: HttpClient, private functionsService:FunctionsService) { }
  get token(): string {
    return this.functionsService.getLocal('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  cargarLogsInit() {
    const url = `${base_url}/logs/all`
    return this.http.get<CargarLogs>(url, this.headers).pipe(
      map((resp) => {
        const Logs = resp.logs.map(
          (log) =>
            new Log(
              log.url,
              log.method,
              log.queryParams,
              log.request,
              log.response,
              log.statusCode,
              log.usuarioCreated,
              log.dateCreated,
              log.uid,
            ),
        )
        return {
          total: Logs.length,
          Logs,
        }
      }),
    )
  }
  cargarLogsAll() {
    const url = `${base_url}/logs/all`

    return this.http.get<CargarLogs>(url, this.headers).pipe(
      map((resp) => {
        const Logs = resp.logs.map(
          (log) =>
            new Log(
              log.url,
              log.method,
              log.queryParams,
              log.request,
              log.response,
              log.statusCode,
              log.usuarioCreated,
              log.dateCreated,
              log.uid,
            ),
        )
        return {
          total: Logs.length,
          Logs,
        }
      }),
    )
  }

  crearLog(formData: Log) {
    let uid = this.functionsService.getLocal('uid')
    formData={
      ...formData,
      usuarioCreated:uid?uid:''
    }
 
    return this.http.post(`${base_url}/logs`, formData, this.headers)
  }


  isActivedLog(Log: Log) {
    const url = `${base_url}/logs/isActive/${Log.uid}`
    const data = {
      ...Log,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarLog(Log: Log) {

    const url = `${base_url}/logs/${Log.uid}`
    const data = {
      ...Log,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarLogById(id: string) {
    const url = `${base_url}/logs/${id}`
    return this.http.get<CargarLog>(url, this.headers)
  }
  cargarLogByClave(clave: string) {
    const url = `${base_url}/logs/clave/${clave}`
    return this.http.get<CargarLog>(url, this.headers)
  }

}
