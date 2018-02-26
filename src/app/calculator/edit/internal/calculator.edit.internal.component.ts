import { Component, Input } from '@angular/core';
import { CalculatorService } from '../../calculator.service';

@Component({
    selector: 'getscore-calc-edit-internal',
    templateUrl: './calculator.edit.internal.component.html',
    styleUrls: ['./calculator.edit.internal.component.css']
})
export class CalculatorEditInternalComponent {
    @Input() node: any;
    constructor(private calculatorService: CalculatorService) {}
}
