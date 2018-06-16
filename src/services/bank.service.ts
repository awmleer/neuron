import {Injectable} from '@angular/core';
import {ApiService} from './api.service'
import {RepoBrief} from '../classes/repo'

@Injectable()
export class BankService {

  constructor(
    private apiSvc: ApiService,
  ) {}

  getRepos(): Promise<RepoBrief[]> {
    return this.apiSvc.get('/bank/repo/list/')
  }

}
