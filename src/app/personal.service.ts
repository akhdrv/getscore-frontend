import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

@Injectable()
export class PersonalService {
    private sessionData: any;
    constructor(private apiService: ApiService) {
        const data = JSON.parse(localStorage.getItem('sessionData'));
        if (data) {
            this.sessionData = data;
        }
    }

    public get LoggedIn(): Observable<boolean> {
        if (this.sessionData) {
            if (this.sessionData.expire < Math.trunc(Date.now() / 1000) - 5) {
                return Observable.of(true);
            } else {
                return this.apiService.Login(this.getHeaders()).map(res => true, err => false);
            }
        }
        return Observable.of(false);
    }

    public LogOut(): Observable<void> {
        return this.apiService.VKLogout().map(_ => {
            localStorage.removeItem('sessionData');
            this.sessionData = undefined;
        });
    }

    public LogIn(): Observable<boolean> {
        return;
    }

    private getHeaders() {
        if (!this.sessionData) {
            return null;
        }
        const session = this.sessionData.session;

        if (session.expire < Math.trunc(Date.now() / 1000) - 5) {
            return {
                'token': session.sig,
                'user_id': session.toString(),
                'expire': session.expire,
                'sid': session.sid
            };
        }
        return null;
    }

    private retrieveFromLocalStorage() {

    }
}
