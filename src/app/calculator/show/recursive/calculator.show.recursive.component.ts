import { Component, AfterViewInit, Input } from '@angular/core';
import { CalculatorService } from '../../calculator.service';

@Component({
    selector: 'app-getscores-recursive',
    templateUrl: './calculator.show.recursive.component.html'
})
export class CalculatorShowRecursiveComponent implements AfterViewInit {
    @Input() node: any;

    constructor(private calculatorService: CalculatorService) {

    }

    ngAfterViewInit() {
    }
}
