import { Component } from '@angular/core';
import { PersonalService } from '../../personal.service';
import { ApiService } from '../../api.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'getscore-user-section',
    templateUrl: './layout.user-section.component.html',
    styleUrls: ['./layout.user-section.component.css']
})
export class LayoutUserSectionComponent {
    private userName: string;
    private photoUrl: string;
    public smallScreen: Observable<BreakpointState>;
    constructor(public personalService: PersonalService, private apiService: ApiService, private breakpointObserver: BreakpointObserver) {
        this.smallScreen = breakpointObserver.observe([
            Breakpoints.XSmall
        ]);
        apiService.VKGetUsers().subscribe((user: any[]) => {
            if (user && user.length > 0) {
                const u = user[0];
                this.userName = u.firstName + ' ' + u.lastName;
                this.photoUrl = u.photoUrl;
            }
        });
    }
}
