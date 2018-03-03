import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

@Injectable()
export class PersonalService {
    private sessionData: any;
    private loggingIn = false;
    constructor(private apiService: ApiService) {
        const data = JSON.parse(localStorage.getItem('sessionData'));
        if (data) {
            this.sessionData = data;
        }
    }

    public get LoggedIn(): Observable<boolean> {
        if (this.sessionData && !this.loggingIn) {
            if (this.sessionData.expire > Math.trunc(Date.now() / 1000) - 5) {
                return Observable.of(true);
            } else {
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
            return this.apiService.Login(this.Headers);
        }, ).catch(_ => {
            this.Logout().subscribe();
            return Observable.of(false);
        }).finally(() => { this.loggingIn = false; });
    }

    public get Headers() {
        if (!this.sessionData) {
            return null;
        }
        const session = this.sessionData;
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
