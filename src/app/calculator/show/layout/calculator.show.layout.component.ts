import { Component, Input, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculatorService } from '../../calculator.service';
import { Subscription } from 'rxjs/Subscription';
import { CalculatorShowRecursiveComponent } from '../recursive/calculator.show.recursive.component';
import { PersonalService } from '../../../personal.service';
import { HierarchyService } from '../../../hierarchy/hierarchy.service';
import { CalculatorShowFormulaInterpreterComponent } from '../../formula-interpreter/calculator.show.formula-interpreter';


@Component({
    selector: 'getscore-calc-show',
    templateUrl: './calculator.show.layout.component.html',
    styleUrls: ['./calculator.show.layout.component.css'],
    providers: [CalculatorService]
})
export class CalculatorShowLayoutComponent implements OnInit {
    private cidSubscription: Subscription;
    private error: boolean;
    private calc: any;

    public constructor(public calculatorService: CalculatorService, private activatedRoute: ActivatedRoute,
        private router: Router, personalService: PersonalService, hierarchyService: HierarchyService) {
        this.cidSubscription = activatedRoute.params.subscribe(params => {
            this.calc = null;
            this.error = false;
            const cid = params['id'];
            calculatorService.GetCalc(cid).subscribe(calc => {
                this.calc = calc;
                if (calc.type === 1) {
                    this.calculatorService.LoadBySchema(calc.schema).subscribe();
                }
            }, err => {
                this.error = true;
            });
        });
    }

    ngOnInit() {
        if (this.calc && this.calc.type === 1) {
            this.calculatorService.Execute().subscribe();
        }
    }
}
