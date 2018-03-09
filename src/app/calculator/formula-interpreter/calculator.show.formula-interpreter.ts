import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'getscore-calc-show-interpreter',
    templateUrl: './calculator.show.formula-interpreter.html',
    styleUrls: ['./calculator.show.formula-interpreter.css']
})
export class CalculatorShowFormulaInterpreterComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() calcId: number;
    @Input() schema: any;

    ngOnInit() {
        /*let a: any;
        a = document.getElementById('grade-formula');
        if (this.schema && this.schema.formula !== undefined) {
            a.value = this.schema.formula;
        } else {
            a.value =
                'Введите формулу оценки, например:\n' +
                'Накопленная = 0.4 * ДЗ + 0.3 * КР1 + 0.3 * КР2\n' +
                'Итоговая = round(0.5 * ЭКЗ + 0.5 * Накопленная)';
        }*/

        const getDiff = function (elem) {
            return parseInt(getComputedStyle(elem).height, 10) - elem.clientHeight;
        };
        const textAreas = [].slice.call(document.querySelectorAll('textarea[data-adaptheight]'));
        textAreas.forEach(function (elem) {
            elem.style.boxSizing = 'border-box';
            elem.style.overflow = 'hidden';
            const minHeight = elem.scrollHeight + getDiff(elem);
            const elemCallback = function () {
                const tmp = scrollY;
                const diff = getDiff(elem);
                elem.style.height = 0;
                elem.style.height = Math.max(minHeight, elem.scrollHeight + diff) + 'px';
                scrollTo(0, tmp);
            };
            elem.addEventListener('input', elemCallback);
            addEventListener('resize', elemCallback);
            elemCallback();
        });


        const symbols = {
            '(': 1, ')': 1, '=': 1, '+': 1, '-': 1, '*': 1,
            '/': 1, '%': 1, '<': 1, '>': 1, ',': 1, '&': 1,
            '|': 1, '^': 1, '~': 1, '!': 1, '?': 1, ':': 1
        };
        const isSymbol = function (s) {
            for (let i = 0; i < s.length; ++i) {
                if (!symbols.hasOwnProperty(s[i])) {
                    return false;
                }
            }
            return true;
        };
        const whitespace = {
            ' ': 1, '\t': 1
        };
        const isWhite = function (s) {
            for (let i = 0; i < s.length; ++i) {
                if (!whitespace.hasOwnProperty(s[i])) {
                    return false;
                }
            }
            return true;
        };
        const isLetter = function (s) {
            return !isSymbol(s) && !isWhite(s);
        };
        const isWord = function (s) {
            let flag = false;
            for (let i = 0; i < s.length; ++i) {
                if (isSymbol(s[i])) {
                    return false;
                }
                flag = flag || isLetter(s[i]);
            }
            return flag;
        };
        const normalize = function (s) {
            let i = 0;
            while (i < s.length && isWhite(s[i])) {
                ++i;
            }
            let c = s[i++];
            while (i < s.length) {
                if (isLetter(s[i])) {
                    if (isWhite(s[i - 1])) {
                        c += ' ';
                    }
                    c += s[i];
                }
                ++i;
            }
            return c;
        };
        const tokens = {
            '(': 1, ')': 1, '=': 1, '+': 1, '-': 1, '*': 1,
            '/': 1, '%': 1, '<': 1, '>': 1, ',': 1, '&': 1,
            '|': 1, '^': 1, '~': 1, '!': 1, '?': 1, ':': 1,
            '==': 1, '!=': 1, '<=': 1, '>=': 1, '&&': 1,
            '||': 1
        };
        const tokenize = function (s) {
            const a = [''];
            for (let i = 0; i < s.length; ++i) {
                if (isSymbol(s[i])) {
                    if (isWord(a[a.length - 1])) {
                        a[a.length - 1] = normalize(a[a.length - 1]);
                        a.push(s[i]);
                    } else {
                        a[a.length - 1] += s[i];
                    }
                } else if (isWhite(s[i])) {
                    if (isWord(a[a.length - 1])) {
                        a[a.length - 1] += s[i];
                    } else if (a[a.length - 1].length > 0 && isSymbol(a[a.length - 1])) {
                        a.push('');
                    }
                } else {
                    if (a[a.length - 1].length > 0 && isSymbol(a[a.length - 1])) {
                        a.push(s[i]);
                    } else {
                        a[a.length - 1] += s[i];
                    }
                }
            }
            if (a[a.length - 1].length === 0) {
                a.pop();
            }
            const b = [];
            for (let i = 0; i < a.length; ++i) {
                if (!isSymbol(a[i])) {
                    b.push(a[i]);
                    continue;
                }
                let l = 0;
                while (l < a[i].length) {
                    let last = '';
                    let cur = '';
                    while (l + cur.length < a[i].length) {
                        cur += a[i][l + cur.length];
                        if (tokens.hasOwnProperty(cur)) {
                            last = cur;
                        }
                    }
                    if (last.length === 0) {
                        return null;
                    }
                    b.push(last);
                    l += last.length;
                }
            }
            return b;
        };
        const priorityUnary = {
            '(': -1, '+': 13, '-': 13, '~': 13, '!': 13
        };
        const priorityBinaryLeft = {
            '(': 1000, '=': 2.1, '+': 11, '-': 11, '*': 12,
            '/': 12, '%': 12, '<': 9, '>': 9, ',': 1,
            '&': 7, '|': 5, '^': 6, '?': 2.75, ':': 2.5,
            '==': 8, '!=': 8, '<=': 9, '>=': 9, '&&': 4,
            '||': 3, '<<': 10, '>>': 10
        };
        const priorityBinaryRight = {
            '(': -1, '=': 2, '+': 11, '-': 11, '*': 12,
            '/': 12, '%': 12, '<': 9, '>': 9, ',': 1,
            '&': 7, '|': 5, '^': 6, '?': 2.75, ':': 2.5,
            '==': 8, '!=': 8, '<=': 9, '>=': 9, '&&': 4,
            '||': 3, '<<': 10, '>>': 10
        };
        const operatorUnary = {
            '(': function (x) { return x; },
            '+': function (x) { return +x; },
            '-': function (x) { return -x; },
            '~': function (x) { return ~x; },
            '!': function (x) { return !x; }
        };
        const operatorBinary = {
            '+': function (x, y) { return x + y; },
            '-': function (x, y) { return x - y; },
            '*': function (x, y) { return x * y; },
            '/': function (x, y) { return x / y; },
            '%': function (x, y) { return x % y; },
            '<': function (x, y) { return x < y; },
            '>': function (x, y) { return x > y; },
            ',': function (x, y) {
                if (typeof x !== 'object') {
                    x = [x];
                }
                if (typeof y !== 'object') {
                    y = [y];
                }
                return x.concat(y);
            },
            '&': function (x, y) { return x & y; },
            '|': function (x, y) { return x | y; },
            '^': function (x, y) { return x ^ y; },
            '?': function (x, y) { return x ? y : []; },
            ':': function (x, y) { return typeof x === 'object' ? y : x; },
            '==': function (x, y) { return x === y; },
            '!=': function (x, y) { return x !== y; },
            '<=': function (x, y) { return x <= y; },
            '>=': function (x, y) { return x >= y; },
            '&&': function (x, y) { return x && y; },
            '||': function (x, y) { return x || y; },
            '<<': function (x, y) { return x << y; },
            '>>': function (x, y) { return x >> y; }
        };
        const operatorFunction = {
            'floor': function (x) { return Math.floor(x); },
            'ceil': function (x) { return Math.ceil(x); },
            'round': function (x) { return Math.round(x); },
            'max': function (x) { return Math.max(x[0], x[1]); },
            'min': function (x) { return Math.min(x[0], x[1]); },
            'if': function (x) { return x[0] ? x[1] : x[2]; }
        };
        const brackets = {
            '(': 1,
            ')': 1
        };
        const bracketsOpen = {
            '(': ')'
        };
        const bracketsClose = {
            ')': '('
        };
        const isOperator = function (x) {
            return typeof x === 'string' && isSymbol(x);
        };
        const buildPriority = function (a, k) {
            while (true) {
                if (a.length <= 1) {
                    break;
                } else {
                    const p = a.length > 2 && !isOperator(a[a.length - 3]) ? priorityBinaryRight : priorityUnary;
                    if (!p.hasOwnProperty(a[a.length - 2])) {
                        return false;
                    }
                    if (p[a[a.length - 2]] >= k) {
                        const b = bracketsOpen.hasOwnProperty(a[a.length - 2]);
                        if (p === priorityUnary) {
                            const x = a.pop();
                            const f = a.pop();
                            a.push({ f: f, x: x });
                        } else {
                            const y = a.pop();
                            const f = a.pop();
                            const x = a.pop();
                            a.push({ f: f, x: x, y: y });
                        }
                        if (b) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            return true;
        };
        const buildExp = function (t) {
            const a = [];
            for (let i = 0; i < t.length; ++i) {
                if (isWord(t[i])) {
                    if (a.length > 0 && !isOperator(a[a.length - 1])) {
                        return null;
                    }
                } else {
                    if (a.length > 0 && !isOperator(a[a.length - 1])) {
                        const b = bracketsClose.hasOwnProperty(t[i]);
                        if (b) {
                            if (!buildPriority(a, -1)) {
                                return null;
                            }
                            if (typeof a[a.length - 1] === 'string' ||
                                !bracketsOpen.hasOwnProperty(a[a.length - 1].f) ||
                                bracketsOpen[a[a.length - 1].f] !== t[i]) {
                                return null;
                            }
                        } else
                            if (!priorityBinaryLeft.hasOwnProperty(t[i]) ||
                                !buildPriority(a, priorityBinaryLeft[t[i]])) {
                                return null;
                            }
                        if (b) {
                            continue;
                        }
                    }
                }
                a.push(t[i]);
            }
            if (a.length === 0 || isOperator(a[a.length - 1])) {
                return null;
            }
            if (!buildPriority(a, 0) || a.length !== 1) {
                return null;
            }
            return a[0];
        };
        const calcTree = function (ctx, s) {
            if (typeof s === 'string') {
                if (!isNaN(s as any)) {
                    return +s;
                }
                if (!ctx.defined.hasOwnProperty(s) && !ctx.params.hasOwnProperty(s)) {
                    ctx.params[s] = 1;
                    ctx.params_arr.push(s);
                }
                return ctx.result.hasOwnProperty(s) ? ctx.result[s] : 0;
            }
            if (s.hasOwnProperty('y')) {
                if (s.f === '=') {
                    if (typeof s.x === 'string' && isNaN(s.x as any)) {
                        if (!ctx.defined.hasOwnProperty(s.x)) {
                            ctx.defined[s.x] = 1;
                            ctx.defined_arr.push(s.x);
                        }
                        const yy = calcTree(ctx, s.y);
                        ctx.result[s.x] = yy;
                        return yy;
                    }
                    return 0;
                }
                if (s.f === '(') {
                    if (typeof s.x === 'string') {
                        const yy = calcTree(ctx, s.y);
                        if (operatorFunction.hasOwnProperty(s.x)) {
                            return operatorFunction[s.x](yy);
                        }
                    }
                    return 0;
                }
                const x = calcTree(ctx, s.x);
                const y = calcTree(ctx, s.y);
                return operatorBinary[s.f](x, y);
            } else {
                const x = calcTree(ctx, s.x);
                return operatorUnary[s.f](x);
            }
        };
        let elem: any;
        elem = document.getElementById('grade-formula');
        const calcId = this.calcId;
        const storageName = 'formula-interpreter#' + calcId;
        const isConstructor = this.editMode;
        const schema = this.schema;

        let containerDefined, containerParams;
        if (isConstructor) {
            containerDefined = document.getElementById('tail-container-defined');
            containerParams = document.getElementById('tail-container-params');
        } else {
            elem.disabled = true;
            containerDefined = document.getElementById('head-container-defined');
            containerParams = document.getElementById('head-container-params');
        }

        const buildDefined = function (ctx) {
            const el = containerDefined;
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            for (let i = 0; i < ctx.defined_arr.length; ++i) {
                const key = ctx.defined_arr[i];
                const elem1 = document.createElement('div');
                elem1.className = 'entry-container';
                const elem2 = document.createElement('div');
                elem2.className = 'input-wrapper';
                let elem3: any;
                elem3 = document.createElement('input');
                elem3.className = 'adaptheight-textarea input-cell';
                elem3.rows = 1;
                elem3.value = ctx.result.hasOwnProperty(key) ? ctx.result[key] : 0;
                elem3.disabled = true;
                const elem4 = document.createElement('span');
                elem4.className = 'input-label';
                elem4.innerText = key;

                elem2.appendChild(elem4);
                elem2.appendChild(elem3);
                elem1.appendChild(elem2);
                el.appendChild(elem1);
            }
        };
        const buildParams = function (ctx) {
            const el = containerParams;
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            for (let i = 0; i < ctx.params_arr.length; ++i) {
                const key = ctx.params_arr[i];
                const elem1 = document.createElement('div');
                elem1.className = 'entry-container';
                const elem2 = document.createElement('div');
                elem2.className = 'input-wrapper';
                let elem3: any;
                elem3 = document.createElement('input');
                elem3.className = 'adaptheight-textarea input-cell';
                elem3.rows = 1;
                elem3.value = ctx.result.hasOwnProperty(key) ? ctx.result[key] : 0;
                (function (k, el3) {
                    el3.addEventListener('input', function () {
                        ctx.result[k] = +el3.value;
                        localStorage[storageName] = JSON.stringify(ctx.result);
                        buildFormula(ctx);
                        buildDefined(ctx);
                    });
                })(key, elem3);
                const elem4 = document.createElement('span');
                elem4.className = 'input-label';
                elem4.innerText = key;

                elem2.appendChild(elem4);
                elem2.appendChild(elem3);
                elem1.appendChild(elem2);
                el.appendChild(elem1);
            }
        };
        const buildFormula = function (ctx) {
            const code = elem.value;
            schema.formula = code;
            const lines = code.match(/^.*$/gm);
            ctx.defined = {};
            ctx.defined_arr = [];
            ctx.params = {};
            ctx.params_arr = [];
            ctx.result = {};
            if (localStorage[storageName]) {
                ctx.result = JSON.parse(localStorage[storageName]);
            }
            for (let i = 0; i < lines.length; ++i) {
                let t: any;
                t = tokenize(lines[i]);
                if (t == null) {
                    continue;
                }
                t = buildExp(t);
                if (t == null) {
                    continue;
                }
                if (typeof t === 'string' || t.f !== '=') {
                    continue;
                }
                calcTree(ctx, t);
            }
        };
        const elemCallback = function () {
            const ctx = {};
            buildFormula(ctx);
            buildParams(ctx);
            buildDefined(ctx);
        };
        elem.addEventListener('input', elemCallback);
        elemCallback();
    }
}
