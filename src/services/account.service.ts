import {Injectable} from '@angular/core'
import {User, LoginData} from '../classes/user'
import {CONST} from '../app/const'
import {ApiService} from './api.service'


@Injectable()
export class AccountService {
  user: User

  constructor(
    private apiSvc: ApiService,
  ) {}

  async initialize(): Promise<void> {
    const result = await this.apiSvc.get('/account/is_logged_in/')
    if (result == 'true') {
      await this.getUserInfo()
    }
  }

  async login(loginData: LoginData): Promise<void> {
    await this.apiSvc.post('/account/login/', {
      phone: loginData.phone,
      password: loginData.password,
    })
    await this.getUserInfo()
  }

  async logout(): Promise<void> {
    await this.apiSvc.get('/account/logout/')
  }

  async getUserInfo(): Promise<User> {
    this.user = await this.apiSvc.get('/account/userinfo/')
    return this.user
  }

}
