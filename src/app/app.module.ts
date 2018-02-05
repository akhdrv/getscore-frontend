import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common/';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { CalculatorShowComponent } from './calculator/show/calculator.show.component';
import { CalculatorService } from './services/calculator.service';
import { LayoutComponent } from './layout/layout.component';
import { UserService } from './services/user.service';
import { gsRoutes } from './app.routes';
import { HierarchyComponent } from './hierarchy/hierarchy.component';


@NgModule({
  declarations: [
    AppComponent,
    CalculatorShowComponent,
    LayoutComponent,
    HierarchyComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(gsRoutes)
  ],
  providers: [CalculatorService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
