import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HierarchyService {
    public Hierarchy: any;
    constructor(apiService: ApiService) {
        apiService.GetHierarchy().subscribe(hierarchy => {
            this.Hierarchy = hierarchy;
        });
    }

    public GetSubjectName(subjectId: number): Observable<string> {
        return Observable.create(_ => {
            return 'HAHAHAHAH';
        });
    }
}
