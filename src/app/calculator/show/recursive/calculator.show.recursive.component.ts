import { Component, Input } from '@angular/core';
import { CalculatorService } from '../../calculator.service';

@Component({
    selector: 'getscore-calc-recursive',
    templateUrl: './calculator.show.recursive.component.html',
    styleUrls: ['./calculator.show.recursive.component.css']
})
export class CalculatorShowRecursiveComponent {
    @Input() node: any;

    constructor(private calculatorService: CalculatorService) {

    }
}
