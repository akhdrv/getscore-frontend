import { Routes } from '@angular/router';
import { CalculatorShowComponent } from './calculator/show/calculator.show.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';

export const gsRoutes: Routes = [
    { path: 'calc/:id', component: CalculatorShowComponent },
    { path: '**', component: HierarchyComponent }
];
