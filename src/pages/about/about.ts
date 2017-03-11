import { Component } from '@angular/core';

// import { NavController } from 'ionic-angular';
import { AppVersion } from 'ionic-native';



@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {
    version:string;

    ngOnInit():void{
        AppVersion.getVersionCode().then(data=>{
            this.version=data;
        });
    }

    // constructor(public navCtrl: NavController) {
    //
    // }

}
