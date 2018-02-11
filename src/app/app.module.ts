import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common/';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { CalculatorShowLayoutComponent } from './calculator/show/layout/calculator.show.layout.component';
import { CalculatorService } from './calculator/calculator.service';
import { LayoutComponent } from './layout/layout.component';
import { PersonalService } from './personal.service';
import { getscoreRoutes } from './app.routes';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SearchComponent } from './search/search.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { CalculatorShowRecursiveComponent } from './calculator/show/recursive/calculator.show.recursive.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    CalculatorShowLayoutComponent,
    CalculatorShowRecursiveComponent,
    LayoutComponent,
    HierarchyComponent,
    UserProfileComponent,
    SearchComponent,
    FavouritesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(getscoreRoutes),
    HttpClientModule
  ],
  providers: [PersonalService],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
