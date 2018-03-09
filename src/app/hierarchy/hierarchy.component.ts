import { Component, Input } from '@angular/core';
import { PersonalService } from '../personal.service';
import { ApiService } from '../api.service';
import { HierarchyService } from './hierarchy.service';

@Component({
    selector: 'getscore-hierarchy',
    templateUrl: './hierarchy.component.html',
    styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent {
    @Input() subjectId: any;
    public selectedFaculty: any;
    public selectedSpeciality: any;
    public selectedSubject: any;
    public selectedYear: any;
    public years: any;
    public specByYear: any;
    constructor(public hierarchyService: HierarchyService) {

    }
    renewYears() {
        this.years = [];
        this.specByYear = this.hierarchyService.GetSpecialitiesGroupedByYears(this.selectedFaculty);
        for (const y in this.specByYear) {
            if (this.specByYear.hasOwnProperty(y)) {
                this.years.push(y);
            }
        }
    }
}
