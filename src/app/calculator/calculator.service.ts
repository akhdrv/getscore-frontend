import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

@Injectable()
export class CalculatorService {
    private nodeReferences: any = {};
    public Schema: any = {};
    public ComputedValues: any = {};

    public constructor(private http: HttpClient) { }

    /*
        public Load(id: any): Observable<boolean> {
            if (isNaN(id) || (+id < 1)) {
                return Observable.of(false);
            }
            const cid = +id;
            if (this.cache[cid]) {
                this.schema = this.cache[cid];
                return Observable.of(false);
            }
            return this.http.get(Globals.SiteUrl + 'schema/' + cid)
                .map((s) => {
                    this.schema = s;
                    return true;
                }, _ => false);
        }
    */
    public Load(id: any) {
        this.Schema = JSON.parse(`{
            "program_id": 0,
            "subject_id": 0,
            "year": 0,
            "calculator": {
                "id": 0,
                "sub": [
                    {
                        "name": "Nakop",
                        "multiplier": 0.6,
                        "id": 1,
                        "actions": [
                            {
                                "action": "conditional",
                                "if": {
                                    "action": "or",
                                    "expression": [
                                        {
                                            "action": "condition",
                                            "first_operand": "2",
                                            "operator": "<=",
                                            "second_operand": 3
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "3",
                                            "operator": "<=",
                                            "second_operand": 3
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "4",
                                            "operator": "<=",
                                            "second_operand": 3
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "5",
                                            "operator": "<=",
                                            "second_operand": 3
                                        }
                                    ]
                                },
                                "then": [
                                    {
                                        "action": "decorate",
                                        "first_operand": "1",
                                        "operator": "*",
                                        "second_operand": 0.8
                                    }
                                ],
                                "else": []
                            }
                        ],
                        "sub": [
                            {
                                "name": "DZ1",
                                "multiplier": 0.25,
                                "id": 2,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ],
                                "sub": []
                            },
                            {
                                "name": "DZ2",
                                "multiplier": 0.25,
                                "id": 3,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ],
                                "sub": []
                            },
                            {
                                "name": "KR1",
                                "multiplier": 0.25,
                                "id": 4,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ],
                                "sub": []
                            },
                            {
                                "name": "KR2",
                                "multiplier": 0.25,
                                "id": 5,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ],
                                "sub": []
                            }
                        ]
                    },
                    {
                        "name": "Exam",
                        "multiplier": 0.4,
                        "id": 6,
                        "actions": [
                            {
                                "action": "conditional",
                                "if": {
                                    "action": "and",
                                    "expression": [
                                        {
                                            "action": "condition",
                                            "first_operand": "6",
                                            "operator": "!=",
                                            "second_operand": 0
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "1",
                                            "operator": ">=",
                                            "second_operand": 4
                                        }
                                    ]
                                },
                                "then": [
                                    {
                                        "action": "decorate",
                                        "first_operand": "1",
                                        "operator": "/",
                                        "second_operand": 0.6
                                    }
                                ]
                            }
                        ],
                        "sub": []
                    }
                ]
            }
        }`);
        this.nodeReferences = {};
        this.ComputedValues = { 0: 0 };
        this.init(this.Schema.calculator);
    }

    public Execute(): void {
        const context = { values: {}, computed: {} };

        for (const n in this.nodeReferences) {
            if (this.nodeReferences.hasOwnProperty(n)) {
                const node = this.nodeReferences[n];
                if (node.hasOwnProperty('value')) {
                    context.values[node.id] = this.filterScore(node.value);
                }
            }
        }

        this.executeComputing(context, 0);

        this.ComputedValues = context.computed;
    }

    private executeComputing(context: any, node_id: number): number {
        if (typeof context.computed[node_id] === 'number') {
            return context.computed[node_id];
        }

        context.computed[node_id] = 0;
        const node = this.nodeReferences[node_id];
        if (node.sub instanceof Array && node.sub.length > 0) {
            for (const n of node.sub) {
                context.computed[node_id] += this.executeComputing(context, n.id) *
                    this.nodeReferences[n.id].multiplier;
            }
        } else {
            context.computed[node_id] = context.values[node_id];
        }
        if (node.actions instanceof Array) {
            for (const n of node.actions) {
                this.executeAction(context, n, node_id);
            }
        }

        return context.computed[node_id];
    }

    private executeAction(context: any, action: any, node_id: number): any {
        if (typeof action.action === 'string' &&
            typeof this['execute' + this.capitalize(action.action)] === 'function') {
            return this['execute' + this.capitalize(action.action)](context, action, node_id);
        }
    }

    private executeConditional(context: any, action: any, node_id: number): void {
        if (action.hasOwnProperty('if') && action.if !== null) {
            if (this.executeAction(context, action.if, node_id)) {
                if (action.then instanceof Array) {
                    for (const a of action.then) {
                        this.executeAction(context, a, node_id);
                    }
                }
            } else {
                if (action.else instanceof Array) {
                    for (const a of action.else) {
                        this.executeAction(context, a, node_id);
                    }
                }
            }
        }
    }

    private executeCondition(context: any, action: any, node_id: number): boolean {
        let first: number, second: number;
        if (typeof action.first_operand === 'string') {
            first = context.computed[action.first_operand];
        } else {
            first = action.first_operand;
        }

        if (typeof action.second_operand === 'string') {
            second = context.computed[action.second_operand];
        } else {
            second = action.second_operand;
        }

        switch (action.operator) {
            case '==':
                return first === second;
            case '!=':
                return first !== second;
            case '>':
                return first > second;
            case '<':
                return first < second;
            case '>=':
                return first >= second;
            case '<=':
                return first <= second;
            default:
                return false;
        }
    }

    private executeRound(context: any, action: any, node_id: number): void {
        if (typeof action.type === 'number') {
            const value = context.computed[node_id];
            switch (action.type) {
                case 0:
                    context.computed[node_id] = Math.round(value);
                    break;
                case -1:
                    context.computed[node_id] = Math.floor(value);
                    break;
                case 1:
                    context.computed[node_id] = Math.ceil(value);
                    break;
                default:
                    context.computed[node_id] = value;
            }
        }
    }

    private executeDecorate(context: any, action: any, node_id: number): void {
        let value: number;
        const second = action.second_operand;
        if (typeof context.computed[node_id] === 'number') {
            value = context.computed[node_id];
            switch (action.operator) {
                case '*':
                    value *= second;
                    break;
                case '/':
                    if (second !== 0) {
                        value /= second;
                    }
                    break;
                case '+':
                    value += second;
                    break;
                case '-':
                    value -= second;
                    break;
            }
            context.computed[node_id] = value;
        }
    }

    private executeAnd(context: any, action: any, node_id: number): boolean {
        if (action.expression instanceof Array) {
            let out = true;
            for (const a of action.expression) {
                out = out && this.executeAction(context, a, node_id);
            }
            return out;
        }
    }

    private executeOr(context: any, action: any, node_id: number): boolean {
        if (action.expression instanceof Array) {
            let out = false;
            for (const a of action.expression) {
                out = out || this.executeAction(context, a, node_id);
            }
            return out;
        }
    }

    /*
    private executeEval(action: any): number {

    }
*/
    private filterScore(score: number): number {
        if (typeof (score) === 'number') {
            if (score >= 0 && score <= 10) {
                return score;
            } else if (score < 0) {
                return 0;
            } else {
                return 10;
            }
        } else {
            return 0;
        }
    }

    private capitalize(str: string): string {
        return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }

    private init(schema: any): void {
        if (schema.hasOwnProperty('id')) {
            this.nodeReferences[schema.id] = schema;
            this.ComputedValues[schema.id] = 0;
            if (!schema.sub || !schema.sub.length) {
                schema.value = 4;
            } else {
                for (const part of schema.sub) {
                    this.init(part);
                }
            }
        }
    }
}
