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

(function() {
	let a: any;
	a = document.getElementById("grade-formula");
	if (this.schema.formula != undefined)
		a.value = this.schema.formula;
	else
		a.value =
				"Введите формулу оценки, например:\n" +
				"НАКОП = 0.4 * ДЗ + 0.3 * КР1 + 0.3 * КР2\n" +
				"ИТОГ = round(0.5 * ЭКЗ + 0.5 * НАКОП)";
})();
(function() {
	var getDiff = function(elem) {
		return parseInt(getComputedStyle(elem).height, 10) - elem.clientHeight;
	};
	var textAreas = [].slice.call(document.querySelectorAll('textarea[data-adaptheight]'));
	textAreas.forEach(function(elem) {
		elem.style.boxSizing = "border-box";
		elem.style.overflow = "hidden";
		var minHeight = elem.scrollHeight + getDiff(elem);
		var elemCallback = function() {
			var tmp = scrollY;
			var diff = getDiff(elem);
			elem.style.height = 0;
			elem.style.height = Math.max(minHeight, elem.scrollHeight + diff) + "px";
			scrollTo(0, tmp);
		};
		elem.addEventListener("input", elemCallback);
		addEventListener("resize", elemCallback);
		elemCallback();
	});
})();
(function() {
	var symbols = {
		'(': 1, ')': 1, '=': 1, '+': 1, '-': 1, '*': 1,
		'/': 1, '%': 1, '<': 1, '>': 1, ',': 1, '&': 1,
		'|': 1, '^': 1, '~': 1, '!': 1, '?': 1, ':': 1
	};
	var isSymbol = function(s) {
		for (var i = 0; i < s.length; ++i)
			if (!symbols.hasOwnProperty(s[i]))
				return false;
		return true;
	};
	var whitespace = {
		' ': 1, '\t': 1
	};
	var isWhite = function(s) {
		for (var i = 0; i < s.length; ++i)
			if (!whitespace.hasOwnProperty(s[i]))
				return false;
		return true;
	};
	var isLetter = function(s) {
		return !isSymbol(s) && !isWhite(s);
	};
	var isWord = function(s) {
		var flag = false;
		for (var i = 0; i < s.length; ++i) {
			if (isSymbol(s[i]))
				return false;
			flag = flag || isLetter(s[i]);
		}
		return flag;
	};
	var normalize = function(s) {
		var i = 0;
		while (i < s.length && isWhite(s[i]))
			++i;
		var c = s[i++];
		while (i < s.length) {
			if (isLetter(s[i])) {
				if (isWhite(s[i - 1]))
					c += " ";
				c += s[i];
			}
			++i;
		}
		return c;
	};
	var tokens = {
		'(': 1, ')': 1, '=': 1, '+': 1, '-': 1, '*': 1,
		'/': 1, '%': 1, '<': 1, '>': 1, ',': 1, '&': 1,
		'|': 1, '^': 1, '~': 1, '!': 1, '?': 1, ':': 1,
		'==': 1, '!=': 1, '<=': 1, '>=': 1, '&&': 1,
		'||': 1
	};
	var tokenize = function(s) {
		var a = [ "" ];
		for (var i = 0; i < s.length; ++i) {
			if (isSymbol(s[i])) {
				if (isWord(a[a.length - 1])) {
					a[a.length - 1] = normalize(a[a.length - 1]);
					a.push(s[i]);
				} else
					a[a.length - 1] += s[i];
			} else if (isWhite(s[i])) {
				if (isWord(a[a.length - 1]))
					a[a.length - 1] += s[i];
				else if (a[a.length - 1].length > 0 && isSymbol(a[a.length - 1]))
					a.push("");
			} else {
				if (a[a.length - 1].length > 0 && isSymbol(a[a.length - 1]))
					a.push(s[i]);
				else
					a[a.length - 1] += s[i];
			}
		}
		if (a[a.length - 1].length == 0)
			a.pop();
		var b = [];
		for (var i = 0; i < a.length; ++i) {
			if (!isSymbol(a[i])) {
				b.push(a[i]);
				continue;
			}
			var l = 0;
			while (l < a[i].length) {
				var last = "";
				var cur = "";
				while (l + cur.length < a[i].length) {
					cur += a[i][l + cur.length];
					if (tokens.hasOwnProperty(cur))
						last = cur;
				}
				if (last.length == 0)
					return null;
				b.push(last);
				l += last.length;
			}
		}
		return b;
	};
	var priorityUnary = {
		'(': -1, '+': 13, '-': 13, '~': 13, '!': 13
	};
	var priorityBinaryLeft = {
		'(': 1000, '=': 2.1, '+': 11, '-': 11, '*': 12,
		'/': 12, '%': 12, '<': 9, '>': 9, ',': 1,
		'&': 7, '|': 5, '^': 6, '?': 2.75, ':': 2.5,
		'==': 8, '!=': 8, '<=': 9, '>=': 9, '&&': 4,
		'||': 3, '<<': 10, '>>': 10
	};
	var priorityBinaryRight = {
		'(': -1, '=': 2, '+': 11, '-': 11, '*': 12,
		'/': 12, '%': 12, '<': 9, '>': 9, ',': 1,
		'&': 7, '|': 5, '^': 6, '?': 2.75, ':': 2.5,
		'==': 8, '!=': 8, '<=': 9, '>=': 9, '&&': 4,
		'||': 3, '<<': 10, '>>': 10
	};
	var operatorUnary = {
		'(': function(x) { return x; },
		'+': function(x) { return +x; },
		'-': function(x) { return -x; },
		'~': function(x) { return ~x; },
		'!': function(x) { return !x; }
	};
	var operatorBinary = {
		'+': function(x, y) { return x + y; },
		'-': function(x, y) { return x - y; },
		'*': function(x, y) { return x * y; },
		'/': function(x, y) { return x / y; },
		'%': function(x, y) { return x % y; },
		'<': function(x, y) { return x < y; },
		'>': function(x, y) { return x > y; },
		',': function(x, y) {
			if (typeof x != "object")
				x = [ x ];
			if (typeof y != "object")
				y = [ y ];
			return x.concat(y);
		},
		'&': function(x, y) { return x & y; },
		'|': function(x, y) { return x | y; },
		'^': function(x, y) { return x ^ y; },
		'?': function(x, y) { return x ? y : []; },
		':': function(x, y) { return typeof x == "object" ? y : x; },
		'==': function(x, y) { return x == y; },
		'!=': function(x, y) { return x != y; },
		'<=': function(x, y) { return x <= y; },
		'>=': function(x, y) { return x >= y; },
		'&&': function(x, y) { return x && y; },
		'||': function(x, y) { return x || y; },
		'<<': function(x, y) { return x << y; },
		'>>': function(x, y) { return x >> y; }
	};
	var operatorFunction = {
		'floor': function(x) { return Math.floor(x); },
		'ceil': function(x) { return Math.ceil(x); },
		'round': function(x) { return Math.round(x); },
		'max': function(x) { return Math.max(x[0], x[1]); },
		'min': function(x) { return Math.min(x[0], x[1]); },
		'if': function(x) { return x[0] ? x[1] : x[2]; }
	};
	var brackets = {
		'(': 1,
		')': 1
	};
	var bracketsOpen = {
		'(': ')'
	};
	var bracketsClose = {
		')': '('
	};
	var isOperator = function(x) {
		return typeof x == "string" && isSymbol(x);
	};
	var buildPriority = function(a, k) {
		while (true) {
			if (a.length <= 1)
				break;
			else {
				var p = a.length > 2 && !isOperator(a[a.length - 3]) ? priorityBinaryRight : priorityUnary;
				if (!p.hasOwnProperty(a[a.length - 2]))
					return false;
				if (p[a[a.length - 2]] >= k) {
					var b = bracketsOpen.hasOwnProperty(a[a.length - 2]);
					if (p == priorityUnary) {
						var x = a.pop();
						var f = a.pop();
						a.push({f: f, x: x});
					} else {
						var y = a.pop();
						var f = a.pop();
						var x = a.pop();
						a.push({f: f, x: x, y: y});
					}
					if (b)
						break;
				} else
					break;
			}
		}
		return true;
	};
	var buildExp = function(t) {
		var a = [];
		for (var i = 0; i < t.length; ++i) {
			if (isWord(t[i])) {
				if (a.length > 0 && !isOperator(a[a.length - 1]))
					return null;
			} else {
				if (a.length > 0 && !isOperator(a[a.length - 1])) {
					var b = bracketsClose.hasOwnProperty(t[i]);
					if (b) {
						if (!buildPriority(a, -1))
							return null;
						if (typeof a[a.length - 1] == "string" || !bracketsOpen.hasOwnProperty(a[a.length - 1].f) || bracketsOpen[a[a.length - 1].f] != t[i])
							return null;
					} else
						if (!priorityBinaryLeft.hasOwnProperty(t[i]) || !buildPriority(a, priorityBinaryLeft[t[i]]))
							return null;
					if (b)
						continue;
				}
			}
			a.push(t[i]);
		}
		if (a.length == 0 || isOperator(a[a.length - 1]))
			return null;
		if (!buildPriority(a, 0) || a.length != 1)
			return null;
		return a[0];
	};
	var calcTree = function(ctx, s) {
		if (typeof s == "string") {
			if (!isNaN(s as any))
				return +s;
			if (!ctx.defined.hasOwnProperty(s) && !ctx.params.hasOwnProperty(s)) {
				ctx.params[s] = 1;
				ctx.params_arr.push(s);
			}
			return ctx.result.hasOwnProperty(s) ? ctx.result[s] : 0;
		}
		if (s.hasOwnProperty("y")) {
			if (s.f == "=") {
				if (typeof s.x == "string" && isNaN(s.x as any)) {
					if (!ctx.defined.hasOwnProperty(s.x)) {
						ctx.defined[s.x] = 1;
						ctx.defined_arr.push(s.x);
					}
					var y = calcTree(ctx, s.y);
					ctx.result[s.x] = y;
					return y;
				}
				return 0;
			}
			if (s.f == "(") {
				if (typeof s.x == "string") {
					var y = calcTree(ctx, s.y);
					if (operatorFunction.hasOwnProperty(s.x))
						return operatorFunction[s.x](y);
				}
				return 0;
			}
			var x = calcTree(ctx, s.x);
			var y = calcTree(ctx, s.y);
			return operatorBinary[s.f](x, y);
		} else {
			var x = calcTree(ctx, s.x);
			return operatorUnary[s.f](x);
		}
	};
	let elem: any;
	elem = document.getElementById("grade-formula");
	var calcId = this.calcId;
	var storageName = "formula-interpreter#" + calcId;
	var isConstructor = this.editMode;

	var containerDefined, containerParams;
	if (isConstructor) {
		containerDefined = document.getElementById("tail-container-defined");
		containerParams = document.getElementById("tail-container-params");
	} else {
		elem.disabled = true;
		containerDefined = document.getElementById("head-container-defined");
		containerParams = document.getElementById("head-container-params");
	}

	var buildDefined = function(ctx) {
		var el = containerDefined;
		while (el.firstChild)
			el.removeChild(el.firstChild);
		for (var i = 0; i < ctx.defined_arr.length; ++i) {
			var key = ctx.defined_arr[i];
			var elem1 = document.createElement("div");
			elem1.className = "entry-container";
			var elem2 = document.createElement("div");
			elem2.className = "input-wrapper";
			var elem3 : any;
			elem3 = document.createElement("input");
			elem3.className = "adaptheight-textarea input-cell";
			elem3.rows = 1;
			elem3.value = ctx.result.hasOwnProperty(key) ? ctx.result[key] : 0;
			elem3.disabled = true;
			var elem4 = document.createElement("span");
			elem4.className = "input-label";
			elem4.innerText = key;

			elem2.appendChild(elem4);
			elem2.appendChild(elem3);
			elem1.appendChild(elem2);
			el.appendChild(elem1);
		}
	};
	var buildParams = function(ctx) {
		var el = containerParams;
		while (el.firstChild)
			el.removeChild(el.firstChild);
		for (var i = 0; i < ctx.params_arr.length; ++i) {
			var key = ctx.params_arr[i];
			var elem1 = document.createElement("div");
			elem1.className = "entry-container";
			var elem2 = document.createElement("div");
			elem2.className = "input-wrapper";
			var elem3 : any;
			elem3 = document.createElement("input");
			elem3.className = "adaptheight-textarea input-cell";
			elem3.rows = 1;
			elem3.value = ctx.result.hasOwnProperty(key) ? ctx.result[key] : 0;
			(function(key, elem3) {
				elem3.addEventListener("input", function() {
					ctx.result[key] = +elem3.value;
					localStorage[storageName] = JSON.stringify(ctx.result);
					buildFormula(ctx);
					buildDefined(ctx);
				});
			})(key, elem3);
			var elem4 = document.createElement("span");
			elem4.className = "input-label";
			elem4.innerText = key;

			elem2.appendChild(elem4);
			elem2.appendChild(elem3);
			elem1.appendChild(elem2);
			el.appendChild(elem1);
		}
	};
	var buildFormula = function(ctx) {
		var code = elem.value;
		this.schema.formula = code;
		var lines = code.match(/^.*$/gm);
		ctx.defined = {};
		ctx.defined_arr = [];
		ctx.params = {};
		ctx.params_arr = [];
		ctx.result = {};
		if (localStorage[storageName])
			ctx.result = JSON.parse(localStorage[storageName]);
		for (var i = 0; i < lines.length; ++i) {
			var t: any;
			t = tokenize(lines[i]);
			if (t == null)
				continue;
			t = buildExp(t);
			if (t == null)
				continue;
			if (typeof t == "string" || t.f != "=")
				continue;
			calcTree(ctx, t);
		}
	};
	var elemCallback = function() {
		var ctx = {};
		buildFormula(ctx);
		buildParams(ctx);
		buildDefined(ctx);
	};
	elem.addEventListener("input", elemCallback);
	elemCallback();
})();
	}
}
