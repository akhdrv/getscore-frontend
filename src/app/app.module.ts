import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common/';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatMenuModule, MatCardModule, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

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
import { ApiService } from './api.service';
import { CalculatorEditComponent } from './calculator/edit/calculator.edit.component';
import { CalculatorEditInternalComponent } from './calculator/edit/internal/calculator.edit.internal.component';
import { CalculatorEditInternalActionSelectorComponent } from './calculator/edit/internal/action-selector/calculator.edit.internal.action-selector';
import { LayoutUserSectionComponent } from './layout/user-section/layout.user-section.component';



@NgModule({
  declarations: [
    CalculatorShowLayoutComponent,
    CalculatorShowRecursiveComponent,
    CalculatorEditComponent,
    CalculatorEditInternalComponent,
    CalculatorEditInternalActionSelectorComponent,
    LayoutComponent,
    HierarchyComponent,
    UserProfileComponent,
    SearchComponent,
    FavouritesComponent,
    LayoutUserSectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(getscoreRoutes),
    HttpClientModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule
  ],
  providers: [PersonalService, ApiService],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
