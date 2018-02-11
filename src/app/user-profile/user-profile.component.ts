import { Component } from '@angular/core';
import { PersonalService } from '../personal.service';

@Component({
    selector: 'app-getscore-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
    constructor(private personalService: PersonalService) {

    }
}
