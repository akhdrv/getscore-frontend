import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CalculatorService } from '../../../calculator.service';

@Component({
    selector: 'getscore-calc-edit-actionselector',
    templateUrl: './calculator.edit.internal.action-selector.html',
    styleUrls: ['./calculator.edit.internal.action-selector.css']
})
export class CalculatorEditInternalActionSelectorComponent implements OnChanges {
    @Input() action: any;
    @Input() context: string;
    @Input() id: number;
    public cond = { first_operand: null, second_operand: null };
    public nodeOptions = [
        { value: 'round', display: 'Округлить' },
        { value: 'conditional', display: 'Условный оператор' },
        { value: 'decorate', display: 'Изменить значение' },
        { value: 'modmult', display: 'Изменить коэффициент' }
    ];
    public roundOptions = [
        { value: -1, display: 'вниз' },
        { value: 0, display: 'арифметически' },
        { value: 1, display: 'вверх' }
    ];
    public decorateOptions = [
        { value: '%', display: 'остаток от деления на' },
        { value: '*', display: 'умножить на' },
        { value: '/', display: 'поделить на' },
        { value: '+', display: 'сложить с' },
        { value: '-', display: 'вычесть' }
    ];
    public modmultOptions = this.decorateOptions.concat({ value: '=', display: 'присвоить' });
    public ifOptions = [
        { value: 'condition', display: 'Условие' },
        { value: 'and', display: 'И' },
        { value: 'or', display: 'Или' }
    ];
    public conditionOptions = [
        { value: '>', display: 'больше' },
        { value: '>=', display: 'больше или равно' },
        { value: '<', display: 'меньше' },
        { value: '<=', display: 'меньше или равно' },
        { value: '!=', display: 'не равно' },
        { value: '==', display: 'равно' }
    ];
    public numrefOptions = [
        { value: 0, display: 'Число' },
        { value: 1, display: 'Значение поля' }
    ];

    public constructor(private calculatorService: CalculatorService) { }

    private clearAction(): void {
        for (const p in this.action) {
            if (this.action.hasOwnProperty(p) && p !== 'action') {
                delete this.action[p];
            }
        }
    }

    ngOnChanges() {
        console.log(this);
        const a = this.action;
        if (a) {
            switch (this.context) {
                case 'decorate':
                case 'modmult':
                    if (!(a.hasOwnProperty('operator') ||
                        a.hasOwnProperty('operand'))) {
                        this.clearAction();
                    }
                    break;
                case 'conditional':
                    if (!(a.hasOwnProperty('else') ||
                        a.hasOwnProperty('then') ||
                        a.hasOwnProperty('if'))) {
                        this.clearAction();
                        a.if = {};
                        a.then = [];
                        a.else = [];
                    }
                    break;
                case 'round':
                    if (!a.hasOwnProperty('type')) {
                        this.clearAction();
                    }
                    break;
                case 'and':
                case 'or':
                    if (!a.hasOwnProperty('expression')) {
                        this.clearAction();
                    }
                    break;
                case 'condition':
                    if (!(a.hasOwnProperty('first_operand') ||
                        a.hasOwnProperty('operator') ||
                        a.hasOwnProperty('second_operand'))) {
                        this.clearAction();
                    }
                    if (typeof a.first_operand === 'string') {
                        this.cond.first_operand = 1;
                    } else if (typeof a.first_operand === 'number') {
                        this.cond.first_operand = 0;
                    }
                    if (typeof a.second_operand === 'string') {
                        this.cond.second_operand = 1;
                    } else if (typeof a.second_operand === 'number') {
                        this.cond.second_operand = 0;
                    }
                    console.log(this.id.toString() + ':');
                    console.log(this.calculatorService.Editor.GetAvailableReferences(this.id));
                    break;
            }
        }
    }
}
