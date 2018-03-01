import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../personal.service';
import { Router } from '@angular/router';
import { MatFormField, MatButton } from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../api.service';

@Component({
    selector: 'getscore-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
    public screenManager: Observable<BreakpointState>;
    constructor(private personalService: PersonalService, private breakpointObserver: BreakpointObserver) {
        // breakpointObserver.observe([Breakpoints.Handset, Breakpoints.])
    }
}
