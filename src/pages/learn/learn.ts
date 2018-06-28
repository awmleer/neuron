import {Component} from '@angular/core'
import {NavController, AlertController, ModalController} from 'ionic-angular'
import {StudyService} from '../../services/study.service'
import {RepoBrief, RepoDetail} from '../../classes/repo'
import {ImpulsePage} from '../impulse/impulse'
import * as _ from 'lodash'
import {BankService} from '../../services/bank.service'
import {ToastService} from '../../services/toast.service'


@Component({
  selector: 'page-learn',
  templateUrl: 'learn.html',
})
export class LearnPage {
  repos: RepoBrief[] = []

  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private studySvc: StudyService,
    private toastSvc: ToastService,
    private bankSvc: BankService,
  ) {}

  todayLearnedCount:number = 0;

  startLearn(repo: RepoBrief): void {
    if (this.studySvc.impulsementsLearning != null && this.studySvc.impulsementsLearning.length>0) {
      let alert = this.alertCtrl.create({
        title: '提醒',
        subTitle: '您有正在进行的学习队列，是否放弃该队列并新建一个学习队列？',
        buttons: [
          {
            text: '取消',
          },
          {
            text: '确定',
            handler: data => {
              //if click yes
              alert.dismiss().then(() => {
                this.newLearn(repo)
              })
              return false
            },
          },
        ],
      })
      alert.present()
    } else {
      this.newLearn(repo)
    }
  }

  newLearn(repo: RepoBrief) {
    let alert = this.alertCtrl.create({
      title: '开始',
      message: '请输入计划新学的单词个数（建议15个-50个）',
      inputs: [
        {
          name: 'amount',
          placeholder: '',
        },
      ],
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: data => {
            let amount = _.toSafeInteger(data.amount)
            if (amount > 0) {
              alert.dismiss().then(() => {
                this.studySvc.generateLearnList(repo, amount).then(() => {
                  this.goImpulsePage()
                })
              })
            } else {
              this.toastSvc.toast('请输入一个正整数')
            }
            return false
          },
        },
      ],
    })
    alert.present()
  }

  continueLearn(): void {
    this.goImpulsePage()
  }

  goImpulsePage() {
    this.modalCtrl.create(ImpulsePage, {
      type: 'learn',
    }).present()
  }

  async ngOnInit() {
    this.repos = await this.bankSvc.getRepos();
  }


  async ionViewWillEnter() {
    this.todayLearnedCount = await this.studySvc.todayLearnedCount()
  }

}
