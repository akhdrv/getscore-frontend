import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../environments/environment';
import { ApiService } from '../api.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

@Injectable()
export class CalculatorService {
    private nodeReferences: any = {};
    private schema: any = {};
    public ComputedValues: any = {};
    private editor: CalculatorEditor = new CalculatorEditor();

    public get Editor(): CalculatorEditor {
        return this.editor;
    }

    public get Schema(): any {
        return this.schema;
    }

    public constructor(private apiService: ApiService) { }

    public LoadById(id: any): Observable<void> {
        return this.apiService.GetSchema(id).map(s => {
            this.loadBySchema(s).subscribe();
        });
    }

    private loadBySchema(s: any): Observable<void> {
        return Observable.create(_ => {
            this.schema = s;
            this.nodeReferences = {};
            this.ComputedValues = { 0: 0 };
            this.init(this.schema.calculator);
        });
    }

    public LoadFromEditor(): Observable<void> {
        return Observable.create(_ => {
            this.loadBySchema(Object.assign({}, this.Editor.Schema)).subscribe();
        });
    }

    public ReloadMultipliersFromEditor(): Observable<void> {
        return Observable.create(_ => {
            for (const id in this.nodeReferences) {
                if (this.nodeReferences.hasOwnProperty(id)) {
                    const node = this.Editor.nodeReferences[id];
                    if (node && node.multiplier) {
                        this.nodeReferences[id].multiplier = node.multiplier;
                    }
                }
            }
        });
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

    public Execute(): Observable<any> {
        return Observable.create(_ => {
            const calculatorExecutor = new CalculatorExecutor(this.nodeReferences);
            calculatorExecutor.Execute(0);
            this.ComputedValues = calculatorExecutor.GetComputedValues();
        });
    }
}

class CalculatorExecutor {
    private context = { values: {}, multipliers: {}, computed: {} };
    public constructor(private nodeReferences: any) {
        for (const n in this.nodeReferences) {
            if (this.nodeReferences.hasOwnProperty(n)) {
                const node = this.nodeReferences[n];
                if (node.hasOwnProperty('value')) {
                    this.context.values[node.id] = this.filterScore(node.value);
                }
                if (node.hasOwnProperty('multiplier')) {
                    this.context.multipliers[node.id] = node.multiplier;
                }
            }
        }
    }

    public GetComputedValues(): any {
        return this.context.computed;
    }

    public Execute(node_id: number): number {
        if (typeof this.context.computed[node_id] === 'number') {
            return this.context.computed[node_id];
        }

        const node = this.nodeReferences[node_id];
        if (node) {
            this.context.computed[node_id] = 0;
            if (node.sub instanceof Array && node.sub.length > 0) {
                for (const n of node.sub) {
                    this.context.computed[node_id] += this.Execute(n.id) *
                        this.context.multipliers[n.id];
                }
            } else {
                this.context.computed[node_id] = this.context.values[node_id];
            }
            if (node.actions instanceof Array) {
                for (const action of node.actions) {
                    this.executeAction(action, node_id);
                }
            }

            return this.context.computed[node_id];
        }
    }

    private executeAction(action: any, node_id: number): any {
        if (typeof action.action === 'string' &&
            typeof this['execute' + this.capitalize(action.action)] === 'function') {
            return this['execute' + this.capitalize(action.action)](action, node_id);
        }
    }

    private executeConditional(action: any, node_id: number): void {
        if (action.hasOwnProperty('if') && action.if !== null) {
            if (this.executeAction(action.if, node_id)) {
                if (action.then instanceof Array) {
                    for (const a of action.then) {
                        this.executeAction(a, node_id);
                    }
                }
            } else {
                if (action.else instanceof Array) {
                    for (const a of action.else) {
                        this.executeAction(a, node_id);
                    }
                }
            }
        }
    }

    private executeCondition(action: any, node_id: number): boolean {
        let first: number, second: number;
        if (typeof action.first_operand === 'string') {
            if (!isNaN(action.first_operand)) {
                first = this.Execute(+action.first_operand);
            }
        } else {
            first = action.first_operand;
        }

        if (typeof action.second_operand === 'string') {
            if (!isNaN(action.second_operand)) {
                first = this.Execute(+action.second_operand);
            }
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

    private executeRound(action: any, node_id: number): void {
        if (typeof action.type === 'number') {
            const value = this.Execute(node_id);
            switch (action.type) {
                case 0:
                    this.context.computed[node_id] = Math.round(value);
                    break;
                case -1:
                    this.context.computed[node_id] = Math.floor(value);
                    break;
                case 1:
                    this.context.computed[node_id] = Math.ceil(value);
                    break;
                default:
                    this.context.computed[node_id] = value;
            }
        }
    }

    private executeDecorate(action: any, node_id: number): void {
        let value: number;
        const operand = action.operand;
        if (typeof this.context.computed[node_id] === 'number') {
            value = this.context.computed[node_id];
            switch (action.operator) {
                case '%':
                    value %= operand;
                    break;
                case '*':
                    value *= operand;
                    break;
                case '/':
                    if (operand !== 0) {
                        value /= operand;
                    }
                    break;
                case '+':
                    value += operand;
                    break;
                case '-':
                    value -= operand;
                    break;
            }
            this.context.computed[node_id] = value;
        }
    }

    private executeAnd(action: any, node_id: number): boolean {
        if (action.expression instanceof Array) {
            let out = true;
            for (const a of action.expression) {
                out = out && this.executeAction(a, node_id);
            }
            return out;
        }
    }

    private executeOr(action: any, node_id: number): boolean {
        if (action.expression instanceof Array) {
            let out = false;
            for (const a of action.expression) {
                out = out || this.executeAction(a, node_id);
            }
            return out;
        }
    }

    private executeModmult(action: any, node_id: number): void {
        let multiplier: number;
        const operand = action.operand;
        if (typeof this.context.computed[node_id] === 'number') {
            multiplier = this.context.multipliers[node_id];
            switch (action.operator) {
                case '%':
                    multiplier %= operand;
                    break;
                case '*':
                    multiplier *= operand;
                    break;
                case '/':
                    if (operand !== 0) {
                        multiplier /= operand;
                    }
                    break;
                case '+':
                    multiplier += operand;
                    break;
                case '-':
                    multiplier -= operand;
                    break;
                case '=':
                    multiplier = operand;
            }
            this.context.multipliers[node_id] = multiplier;
        }
    }

    private executeCompute(action: any, node_id: number): any {
        const first_operand = action.first_operand,
            second_operand = action.second_operand,
            operator = action.operator;
        let result: number;
        if (!isNaN(first_operand) && !isNaN(first_operand) && operator) {
            switch (operator) {
                case '%':
                    result = first_operand % second_operand;
                    break;
                case '*':
                    result = first_operand * second_operand;
                    break;
                case '/':
                    if (second_operand !== 0) {
                        result = first_operand / second_operand;
                    }
                    break;
                case '+':
                    result = first_operand + second_operand;
                    break;
                case '-':
                    result = first_operand - second_operand;
                    break;
            }

            return result;
        }
    }

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
}

class CalculatorEditor {
    private schema: any;
    public nodeReferences: any;
    private currentId: number;
    public constructor() { }

    public Create(programId: number, subjectId: number) {
        this.currentId = 0;
        this.schema = {
            program_id: programId,
            subject_id: subjectId,
            year: (_ => {
                const date = new Date();
                if (date.getMonth() + 1 < 7) {
                    return date.getFullYear() - 1;
                } else {
                    return date.getFullYear();
                }
            })(),
            calculator: {
                id: this.currentId++,
                actions: [],
                sub: []
            }
        };
        this.refreshReferences();
    }

    public get Schema(): any {
        return this.schema;
    }

    private refreshReferences(): void {
        this.nodeReferences = {};
        this.init(this.schema.calculator);
    }

    private getParentOf(nodeId): any {
        for (const ref in this.nodeReferences) {
            if (this.nodeReferences.hasOwnProperty(ref)) {
                const node = this.nodeReferences[ref];
                if (node.sub instanceof Array) {
                    for (const c of node.sub) {
                        if (c.id === nodeId) {
                            return node;
                        }
                    }
                }
            }
        }
    }

    private init(schema: any): void {
        if (schema.hasOwnProperty('id')) {
            this.nodeReferences[schema.id] = schema;
            if (!schema.sub || !schema.sub.length) {
                schema.value = 4;
            } else {
                for (const part of schema.sub) {
                    this.init(part);
                }
            }
        }
    }

    public InsertChild(parentId: number, childName: string, mult: number = null, position?: number): void {
        if (this.nodeReferences.hasOwnProperty(parentId)) {
            const node = {
                id: this.currentId,
                name: childName,
                multiplier: mult,
                actions: [],
                sub: []
            };
            if (position && position >= 0) {
                this.nodeReferences[parentId].sub.splice(position, 0, node);
            } else {
                this.nodeReferences[parentId].sub.push(node);
            }
            this.nodeReferences[this.currentId++] = node;
            this.refreshReferences();
        }
    }

    public MoveNode(nodeId: number, destinationParentId: number, position?: number): void {
        const parentNode = this.getParentOf(nodeId);
        const destinationParentNode = this.nodeReferences[destinationParentId];
        const node = this.nodeReferences[nodeId];
        if (node && parentNode && destinationParentNode) {
            parentNode.sub.splice(parentNode.sub.indexOf(node), 1);
            if (position && position >= 0) {
                destinationParentNode.sub.splice(position, 0, node);
            } else {
                destinationParentNode.sub.push(node);
            }
            this.refreshReferences();
        }
    }

    public RemoveNode(node_id: number): void {
        const node = this.nodeReferences[node_id];
        const parentNode = this.getParentOf(node_id);

        if (node && parentNode) {
            parentNode.sub.splice(parentNode.sub.indexOf(node), 1);
            this.refreshReferences();
        }
    }

    public RenameNode(node_id: number, name: string): void {
        const node = this.nodeReferences[node_id];
        node.name = name;
    }

    public ChangeMultiplier(node_id: number, multiplier: number): void {
        const node = this.nodeReferences[node_id];
        if (node.id !== 0) {
            node.multiplier = multiplier;
        }
    }

    // public GetPossibleActions(node_id: number): string[] {
    // }
}
