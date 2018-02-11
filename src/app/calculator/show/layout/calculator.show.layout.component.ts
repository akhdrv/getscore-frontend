import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculatorService } from '../../calculator.service';
import { Subscription } from 'rxjs/Subscription';
import { CalculatorShowRecursiveComponent } from '../recursive/calculator.show.recursive.component';

@Component({
    selector: 'app-gs-calc',
    templateUrl: './calculator.show.layout.component.html',
    providers: [CalculatorService]
})
export class CalculatorShowLayoutComponent {
    private cidSubscription: Subscription;
    private error: boolean;

    public constructor(private calculatorService: CalculatorService, private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.cidSubscription = activatedRoute.params.subscribe(params => {
            const cid = params['id'];
            calculatorService.Load(cid);
        });
    }

    kek() {
        console.log(this.calculatorService);
    }
}
