import { Component } from '@angular/core';
import { PersonalService } from '../personal.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-getscore-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
    constructor(private personalService: PersonalService) {

    }
}
