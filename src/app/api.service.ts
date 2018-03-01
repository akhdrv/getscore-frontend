import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/operator/mergeMap';

declare var VK: any;

class VKMapper {
    public Login(settings: any, callback: any) {
        return VK.Api.login(settings, callback);
    }
}

@Injectable()
export class ApiService {
    private vk: VKMapper = new VKMapper();
    public constructor(private httpClient: HttpClient) {
        VK.init({
            apiId: 6376226
        });
    }

    public GetSchema(id: number): Observable<any> {
        return Observable.of(JSON.parse(`{
            "program_id": 0,
            "subject_id": 0,
            "year": 0,
            "calculator": {
                "id": 0,
                "actions": [
                    {
                        "action": "round",
                        "type": 0
                    }
                ],
                "sub": [
                    {
                        "name": "Nakop",
                        "multiplier": 0.6,
                        "id": 1,
                        "actions": [
                            {
                                "action": "conditional",
                                "if": {
                                    "action": "or",
                                    "expression": [
                                        {
                                            "action": "condition",
                                            "first_operand": "2",
                                            "operator": "<=",
                                            "second_operand": 3
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "3",
                                            "operator": "<=",
                                            "second_operand": 3
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "4",
                                            "operator": "<=",
                                            "second_operand": 3
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "5",
                                            "operator": "<=",
                                            "second_operand": 3
                                        }
                                    ]
                                },
                                "then": [
                                    {
                                        "action": "decorate",
                                        "operator": "*",
                                        "operand": 0.8
                                    }
                                ]
                            },
                            {
                                "action": "conditional",
                                "if": {
                                    "action": "and",
                                    "expression": [
                                        {
                                            "action": "condition",
                                            "first_operand": "6",
                                            "operator": "==",
                                            "second_operand": 0
                                        },
                                        {
                                            "action": "condition",
                                            "first_operand": "1",
                                            "operator": ">=",
                                            "second_operand": 4
                                        }
                                    ]
                                },
                                "then": [
                                    {
                                        "action": "modmult",
                                        "operator": "=",
                                        "operand": 1
                                    }
                                ]
                            }
                        ],
                        "sub": [
                            {
                                "name": "DZ1",
                                "multiplier": 0.25,
                                "id": 2,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ]
                            },
                            {
                                "name": "DZ2",
                                "multiplier": 0.25,
                                "id": 3,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ]
                            },
                            {
                                "name": "KR1",
                                "multiplier": 0.25,
                                "id": 4,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ]
                            },
                            {
                                "name": "KR2",
                                "multiplier": 0.25,
                                "id": 5,
                                "actions": [
                                    {
                                        "action": "round",
                                        "type": 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Exam",
                        "multiplier": 0.4,
                        "id": 6
                    }
                ]
            }
        }`));
    }

    public VKLogin(): Observable<any> {
        const vkLogin = Observable.bindCallback(this.vk.Login);
        return vkLogin(1 + Math.pow(2, 16));
        // VK.Auth.login(this.loginCb, 1);
    }

    public VKLogout(): Observable<void> {
        const vkLogout = Observable.bindCallback(VK.Auth.logout);
        return vkLogout();
    }

    public Login(headers: any): Observable<boolean> {
        return this.httpClient.post('/api/login',
            {
                'headers': headers
            }).map((res: any) => res.NewUser);
    }


}
