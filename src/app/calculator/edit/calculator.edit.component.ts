import { Component } from '@angular/core';
import { CalculatorService } from '../calculator.service';

@Component({
    selector: 'getscore-calc-edit',
    templateUrl: './calculator.edit.component.html',
    styleUrls: ['./calculator.edit.component.css'],
    providers: [CalculatorService]
})
export class CalculatorEditComponent {
    public constructor(public calculatorService: CalculatorService) {
        calculatorService.Editor.Create(1, 1);
    }
}
