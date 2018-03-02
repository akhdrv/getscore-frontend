import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import 'rxjs/add/operator/catch';

@Injectable()
export class PersonalService {
    private sessionData: any;
    private loggingIn = false;
    constructor(private apiService: ApiService) {
        const data = JSON.parse(localStorage.getItem('sessionData'));
        if (data && data.session) {
            this.sessionData = data;
        }
    }

    public get LoggedIn(): Observable<boolean> {
        if (this.sessionData) {
            if (this.sessionData.session.expire > Math.trunc(Date.now() / 1000) - 5) {
                return Observable.of(true);
            } else if (!this.loggingIn) {
                this.Login();
            }
        }
        return Observable.of(false);
    }

    public Logout(): Observable<void> {
        return Observable.create(_ => {
            localStorage.removeItem('sessionData');
            this.sessionData = undefined;
        });
    }

    public Login(): Observable<boolean> {
        this.loggingIn = true;
        return this.apiService.VKLogin().mergeMap(data => {
            this.sessionData = data;
            localStorage.setItem('sessionData', JSON.stringify(data));
            return this.apiService.Login(this.getHeaders()).map(res => true, err => {
                localStorage.removeItem('sessionData');
                this.sessionData = null;
            }).map(r => {
                this.loggingIn = false;
                return r;
            });
        }, ).catch(_ => {
            this.Logout().subscribe();
            return Observable.of(false);
        });
    }

    private getHeaders() {
        if (!this.sessionData) {
            return null;
        }
        const session = this.sessionData.session;
        if (session.expire > Math.trunc(Date.now() / 1000) - 5) {
            const out = {
                'sig': session.sig,
                'mid': session.mid,
                'expire': session.expire.toString(),
                'sid': session.sid,
                'secret': session.secret
            };
            return out;
        }
        return null;
    }
}
