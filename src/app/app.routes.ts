import { Routes } from '@angular/router';
import { CalculatorShowLayoutComponent } from './calculator/show/layout/calculator.show.layout.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';

export const getscoreRoutes: Routes = [
    { path: 'calc/:id', component: CalculatorShowLayoutComponent },
    { path: '**', component: HierarchyComponent }
];
