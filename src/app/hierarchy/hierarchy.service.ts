import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HierarchyService {
    public Hierarchy: any;

    constructor(apiService: ApiService) {
        apiService.GetHierarchy().subscribe(hierarchy => {
            this.Hierarchy = hierarchy;
        });
    }

    public GetSubjectName(subjectId: number): string {
        if (this.Hierarchy) {
            const faculties = this.Hierarchy.Faculties;
            for (const faculty of faculties) {
                for (const speciality of faculty.Specialities) {
                    for (const subject of speciality.Subjects) {
                        if (subject.SubjectId === subjectId) {
                            return subject.SubjectName;
                        }
                    }
                }
            }
        }

        return null;
    }

    public GetSpecialitiesGroupedByYears(faculty: any): any {
        const out = {};
        for (const speciality of faculty.Specialities) {
            if (!out[speciality.GraduationYear]) {
                out[speciality.GraduationYear] = [];
            }
            out[speciality.GraduationYear].push(speciality);
        }
        return out;
    }
}
