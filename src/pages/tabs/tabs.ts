import { Component } from '@angular/core';

import { LearnPage } from '../learn/learn';
import { ReviewPage } from '../review/review';
import {SettingsPage} from "../settings/settings";
import {WordService} from "../../services/word.service";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = LearnPage;
    tab2Root: any = ReviewPage;
    tab3Root: any = SettingsPage;

    constructor(public wordService:WordService) {

    }
}
