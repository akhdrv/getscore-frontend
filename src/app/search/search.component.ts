import { Component } from '@angular/core';
import { PersonalService } from '../personal.service';

@Component({
    selector: 'getscore-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {
    constructor(private personalService: PersonalService) {

    }
}
