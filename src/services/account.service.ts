import {Injectable} from '@angular/core'
import {User, LoginData} from '../classes/user'
import {CONST} from '../app/const'
import {ApiService} from './api.service'


@Injectable()
export class AccountService {
  user: User = null

  constructor(
    private apiSvc: ApiService,
  ) {}

  async initialize(): Promise<void> {
    await this.getUserProfile()
  }

  async login(loginData: LoginData): Promise<void> {
    await this.apiSvc.post('/account/login/', {
      username: loginData.username,
      password: loginData.password,
    })
    await this.getUserProfile()
  }

  async signup(data):Promise<void>{
    await this.apiSvc.post('/account/signup/', data)
    await this.getUserProfile()
  }

  async logout(): Promise<void> {
    await this.apiSvc.get('/account/logout/')
    this.user = null
  }

  async getUserProfile(): Promise<User> {
    this.user = await this.apiSvc.get('/account/profile/')
    return this.user
  }

}
