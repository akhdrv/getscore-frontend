import { Component } from '@angular/core';
import { PersonalService } from '../personal.service';

@Component({
    selector: 'app-getscore-favourites',
    templateUrl: './favourites.component.html',
    styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent {
    constructor(private personalService: PersonalService) {

    }
}
