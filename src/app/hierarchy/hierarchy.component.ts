import { Component } from '@angular/core';
import { PersonalService } from '../personal.service';

@Component({
    selector: 'getscore-hierarchy',
    templateUrl: './hierarchy.component.html',
    styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent {
    constructor(private personalService: PersonalService) {

    }
}
