import {Component} from '@angular/core'

import {LearnPage} from '../learn/learn'
import {ReviewPage} from '../review/review'
import {SettingsPage} from '../settings/settings'
import {AccountService} from '../../services/account.service'
import {StudyService} from '../../services/study.service'

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = LearnPage
  tab2Root: any = ReviewPage
  tab3Root: any = SettingsPage

  constructor(
    public studySvc: StudyService,
    private accountSvc: AccountService,
  ) {}

}
