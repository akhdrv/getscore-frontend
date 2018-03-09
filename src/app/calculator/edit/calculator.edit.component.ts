import { Component, OnInit } from '@angular/core';
import { CalculatorService } from '../calculator.service';
import { ApiService } from '../../api.service';
import { PersonalService } from '../../personal.service';
import { Router } from '@angular/router';

@Component({
    selector: 'getscore-calc-edit',
    templateUrl: './calculator.edit.component.html',
    styleUrls: ['./calculator.edit.component.css'],
    providers: [CalculatorService]
})
export class CalculatorEditComponent {
    public SubjectId: any = {};
    public Schema: any = { };
    public constructor(public calculatorService: CalculatorService,
        public apiService: ApiService, public personalService: PersonalService, private router: Router) {
        /*api.GetSchema(5).subscribe(s => {
            calculatorService.Editor.Open(s);
        });*/
        // calculatorService.Editor.Create(1, 1);
    }
    create() {
        if (this.SubjectId.value && this.Schema.formula) {
            this.apiService.CreateCalculator(2, this.SubjectId.value,
                this.Schema.formula, this.personalService.Headers).subscribe(res => {
                    this.router.navigate(['/calc', res]);
                });
        }
    }
}
