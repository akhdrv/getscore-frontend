import { Component, Input } from '@angular/core';
import { CalculatorService } from '../../calculator.service';

@Component({
    selector: 'app-getscores-recursive',
    templateUrl: './calculator.show.recursive.component.html'
})
export class CalculatorShowRecursiveComponent {
    @Input() node: any;

    constructor(private calculatorService: CalculatorService) {

    }
}
