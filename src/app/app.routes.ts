import { Routes } from '@angular/router';
import { CalculatorShowLayoutComponent } from './calculator/show/layout/calculator.show.layout.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { CalculatorEditComponent } from './calculator/edit/calculator.edit.component';

export const getscoreRoutes: Routes = [
    { path: 'add', component: CalculatorEditComponent },
    { path: 'calc/:id', component: CalculatorShowLayoutComponent },
    { path: '**', component: HierarchyComponent }
];
