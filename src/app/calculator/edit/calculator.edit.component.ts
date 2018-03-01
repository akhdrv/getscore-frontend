import { Component, OnInit } from '@angular/core';
import { CalculatorService } from '../calculator.service';
import { ApiService } from '../../api.service';

@Component({
    selector: 'getscore-calc-edit',
    templateUrl: './calculator.edit.component.html',
    styleUrls: ['./calculator.edit.component.css'],
    providers: [CalculatorService]
})
export class CalculatorEditComponent implements OnInit {
    public constructor(public calculatorService: CalculatorService, public api: ApiService) {
        /*api.GetSchema(5).subscribe(s => {
            calculatorService.Editor.Open(s);
        });*/
        calculatorService.Editor.Create(1, 1);
    }
    ngOnInit() {
        console.log(this.calculatorService);
    }
}
