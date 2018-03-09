import { Routes } from '@angular/router';
import { CalculatorShowLayoutComponent } from './calculator/show/layout/calculator.show.layout.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { CalculatorEditComponent } from './calculator/edit/calculator.edit.component';
import { CalculatorShowFormulaInterpreterComponent } from './calculator/formula-interpreter/calculator.show.formula-interpreter';

export const getscoreRoutes: Routes = [
    { path: 'ayrat', component: CalculatorShowFormulaInterpreterComponent },
    { path: 'add', component: CalculatorEditComponent },
    { path: 'calc/:id', component: CalculatorShowLayoutComponent },
    { path: '**', redirectTo: 'add' }
];
