import {Injectable} from '@angular/core'
import 'rxjs/add/operator/toPromise'
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'
import {ApiError} from '../classes/error'
import {ToastService} from './toast.service'
import {Storage} from '@ionic/storage'
import {CONST} from '../app/const'

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private toastSvc: ToastService,
    private storage: Storage,
  ) {}

  get sessionId(): Promise<string> {
    return this.storage.get('sessionId').then((s) => {
      if (s) {
        return s
      } else {
        return ''
      }
    })
  }

  private handleHttp(request: Observable<Object>) {
    return request.toPromise().catch((error: HttpErrorResponse) => {
      let apiError:ApiError
      if (error.status === 444 && error.error){
        apiError = new ApiError(
          error.error.message,
          error.error.payload
        )
      } else if (error.status === 403) {
        apiError = new ApiError('您没有权限进行该操作')
      } else {
        console.error(error)
        apiError = new ApiError('出错了')
      }
      throw apiError
    }).then(async (res: HttpResponse<object>) => {
      const data = res.body
      const sessionId = res.headers.get('App-Set-Session-Id')
      if (sessionId) {
        await this.storage.set('sessionId', sessionId)
      }
      return data
    }).catch((error) => {
      if (error instanceof ApiError) {
        this.toastSvc.toast(error.message)
      }
      throw error
    })
  }

  async get(
    url: string,
    params: {
      [param: string]: any
    } = null,
  ): Promise<any> {
    let request = this.http.get(CONST.apiUrl + url, {
      params: params,
      observe: 'response',
      headers: {
        'App-Session-Id': await this.sessionId,
      },
      withCredentials: true,
    })
    return this.handleHttp(request)
  }

  async post(url: string, body: object = null): Promise<any> {
    let request = this.http.post(CONST.apiUrl + url, body, {
      observe: 'response',
      headers: {
        'App-Session-Id': await this.sessionId,
      },
      withCredentials: true,
    })
    return this.handleHttp(request)
  }

}
