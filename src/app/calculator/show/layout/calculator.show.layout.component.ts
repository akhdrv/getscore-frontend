import { Component, Input, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculatorService } from '../../calculator.service';
import { Subscription } from 'rxjs/Subscription';
import { CalculatorShowRecursiveComponent } from '../recursive/calculator.show.recursive.component';

@Component({
    selector: 'getscore-calc-show',
    templateUrl: './calculator.show.layout.component.html',
    styleUrls: ['./calculator.show.layout.component.css'],
    providers: [CalculatorService]
})
export class CalculatorShowLayoutComponent implements OnInit {
    private cidSubscription: Subscription;
    private error: boolean;

    public constructor(public calculatorService: CalculatorService, private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.cidSubscription = activatedRoute.params.subscribe(params => {
            const cid = params['id'];
            calculatorService.LoadById(cid).subscribe();
        });
    }

    ngOnInit() {
        this.calculatorService.Execute().subscribe();
    }
}
