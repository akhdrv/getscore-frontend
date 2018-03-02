import { Component } from '@angular/core';
import { PersonalService } from '../../personal.service';

@Component({
    selector: 'getscore-user-section',
    templateUrl: './layout.user-section.component.html',
    styleUrls: ['./layout.user-section.component.css']
})
export class LayoutUserSectionComponent {
    constructor(private personalService: PersonalService) {

    }
}
