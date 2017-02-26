import {Component, Input} from '@angular/core';


@Component({
    selector: 'progress-icon',
    templateUrl: 'progress-icon.html'
})
export class ProgressIconComponent {
    constructor() {}
    @Input()
    percent:number;

}
