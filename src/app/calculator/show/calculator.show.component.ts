import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-gs-cnode',
    templateUrl: './calculator.show.component.html'
})
export class CalculatorShowComponent {
    @Input() public representation: any;
    @Input() public rootElem: boolean;
    public constructor() {
        // Calculator Layout / other partition needed!
    }
}
