import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../environments/environment';
import { ApiService } from '../api.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import { PersonalService } from '../personal.service';

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

    public constructor(private apiService: ApiService, private personalService: PersonalService) { }

    public LoadById(id: any): Observable<void> {
        return this.apiService.GetSchema(id).map(s => {
            this.loadBySchema(s).subscribe();
        });
    }

    private loadBySchema(schema: any): Observable<void> {
        return Observable.create(_ => {
            this.schema = schema;
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

    public Execute(nodeId: number): number {
        if (typeof this.context.computed[nodeId] === 'number') {
            return this.context.computed[nodeId];
        }

        const node = this.nodeReferences[nodeId];
        if (node) {
            this.context.computed[nodeId] = 0;
            if (node.sub instanceof Array && node.sub.length > 0) {
                for (const n of node.sub) {
                    this.context.computed[nodeId] += this.Execute(n.id) *
                        this.context.multipliers[n.id];
                }
            } else {
                this.context.computed[nodeId] = this.context.values[nodeId];
            }
            if (node.actions instanceof Array) {
                for (const action of node.actions) {
                    this.executeAction(action, nodeId);
                }
            }

            return this.context.computed[nodeId];
        }
    }

    private executeAction(action: any, nodeId: number): any {
        if (typeof action.action === 'string' &&
            typeof this['execute' + this.capitalize(action.action)] === 'function') {
            return this['execute' + this.capitalize(action.action)](action, nodeId);
        }
    }

    private executeConditional(action: any, nodeId: number): void {
        if (action.hasOwnProperty('if') && action.if !== null) {
            if (this.executeAction(action.if, nodeId)) {
                if (action.then instanceof Array) {
                    for (const a of action.then) {
                        this.executeAction(a, nodeId);
                    }
                }
            } else {
                if (action.else instanceof Array) {
                    for (const a of action.else) {
                        this.executeAction(a, nodeId);
                    }
                }
            }
        }
    }

    private executeCondition(action: any, nodeId: number): boolean {
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

    private executeRound(action: any, nodeId: number): void {
        if (typeof action.type === 'number') {
            const value = this.Execute(nodeId);
            switch (action.type) {
                case 0:
                    this.context.computed[nodeId] = Math.round(value);
                    break;
                case -1:
                    this.context.computed[nodeId] = Math.floor(value);
                    break;
                case 1:
                    this.context.computed[nodeId] = Math.ceil(value);
                    break;
                default:
                    this.context.computed[nodeId] = value;
            }
        }
    }

    private executeDecorate(action: any, nodeId: number): void {
        let value: number;
        const operand = action.operand;
        if (typeof this.context.computed[nodeId] === 'number') {
            value = this.context.computed[nodeId];
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
            this.context.computed[nodeId] = value;
        }
    }

    private executeAnd(action: any, nodeId: number): boolean {
        if (action.expression instanceof Array) {
            let out = true;
            for (const a of action.expression) {
                out = out && this.executeAction(a, nodeId);
            }
            return out;
        }
    }

    private executeOr(action: any, nodeId: number): boolean {
        if (action.expression instanceof Array) {
            let out = false;
            for (const a of action.expression) {
                out = out || this.executeAction(a, nodeId);
            }
            return out;
        }
    }

    private executeModmult(action: any, nodeId: number): void {
        let multiplier: number;
        const operand = action.operand;
        if (typeof this.context.computed[nodeId] === 'number') {
            multiplier = this.context.multipliers[nodeId];
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
            this.context.multipliers[nodeId] = multiplier;
        }
    }

    private executeCompute(action: any, nodeId: number): any {
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

    public Open(s: any) {
        this.schema = Object.assign({}, s);
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

    public RemoveNode(nodeId: number): void {
        const node = this.nodeReferences[nodeId];
        const parentNode = this.getParentOf(nodeId);

        if (node && parentNode) {
            parentNode.sub.splice(parentNode.sub.indexOf(node), 1);
            this.refreshReferences();
        }
    }

    public RenameNode(nodeId: number, name: string): void {
        const node = this.nodeReferences[nodeId];
        node.name = name;
    }

    public ChangeMultiplier(nodeId: number, multiplier: number): void {
        const node = this.nodeReferences[nodeId];
        if (node.id !== 0) {
            node.multiplier = multiplier;
        }
    }

    public AddAction(nodeId: number): void {
        const node = this.nodeReferences[nodeId];
        if (node && node.actions instanceof Array) {
            node.actions.push({});
        }
    }

    public AddActionTo(listReference: any[]): void {
        if (listReference) {
            listReference.push({});
        }
    }

    public GetAvailableReferences(nodeId: number): any[] {
        const children = this.getChildrenOf(this.getParentOf(nodeId).id),
            references = this.getNodesReferencing(nodeId);

        const availableReferences = children.filter(el => { if (el === nodeId || references.indexOf(el) === -1) { return el; } });
        return availableReferences.map(el => ({ value: el.toString(), display: this.nodeReferences[el].name }));
    }

    private getChildrenOf(nodeId: number): number[] {
        const node = this.nodeReferences[nodeId];
        if (node) {
            let out = [];
            if (node.sub instanceof Array) {
                for (const child of node.sub) {
                    out.push(child.id);
                    out = out.concat(this.getChildrenOf(child.id));
                }
            }
            return out;
        }

        return [];
    }

    private getNodesReferencing(nodeId: number): number[] {
        const out = [];
        for (const n in this.nodeReferences) {
            if (this.nodeReferences.hasOwnProperty(n)) {
                const node = this.nodeReferences[n];
                let references = false;
                if (node.id !== nodeId && node.actions instanceof Array) {
                    for (const a of node.actions) {
                        references = references || this.scanActionForReference(a, nodeId);
                    }
                }
                if (references) {
                    out.push(node.id);
                }
            }
        }
        return out;
    }

    private scanActionForReference(action: any, ref: number): boolean {
        let out = false;
        switch (action.action) {
            case 'conditional':
                if (action.if) {
                    out = out || this.scanActionForReference(action.if, ref);
                }
                if (action.then) {
                    for (const a of action.then) {
                        out = out || this.scanActionForReference(a, ref);
                    }
                }
                if (action.else) {
                    for (const a of action.else) {
                        out = out || this.scanActionForReference(a, ref);
                    }
                }
                break;
            case 'condition':
                if ((+(action.first_operand) === ref) || (+(action.second_operand) === ref)) {
                    return true;
                }
                break;
            case 'and':
            case 'or':
                for (const a of action.expression) {
                    out = out || this.scanActionForReference(a, ref);
                }
                break;
        }
        return out;
    }

    public MoveAction(nodeId: number, actionPosition: number, destinationPosition: number): void {
        const node = this.nodeReferences[nodeId];
        if (node && node.actions instanceof Array && actionPosition >= 0 &&
            actionPosition < node.actions.length && destinationPosition >= 0) {
            const action = node.actions[actionPosition];
            node.actions.splice(destinationPosition, 0, action);
            node.actions.splice(actionPosition, 1);
        }
    }

    // public RemoveActionFrom()
}
