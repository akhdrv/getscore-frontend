import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

declare var VK: any;

@Injectable()
export class ApiService {
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
        const vkLogin = Observable.bindCallback((settings, callback) => {
            VK.Auth.login(callback, settings);
        });
        return vkLogin(1).map((data: any) => {
            if (!data.session) {
                throw new Error();
            }

            return data.session;
        });
    }

    public VKGetUsers(ids?: number[]): Observable<any[]> {
        const request: any = {
            v: '5', fields: ['crop_photo']
        };
        if (ids) {
            request.user_ids = ids;
        }
        const apiCall: any = Observable.bindCallback(VK.Api.call);
        return apiCall('users.get', request).map((res: any) => {
            if (res.response) {
                const out = [];
                for (const user of res.response) {
                    const u: any = {};
                    u.firstName = user.first_name;
                    u.lastName = user.last_name;
                    u.photoUrl = null;
                    if (user.crop_photo) {
                        u.photoUrl = user.crop_photo.photo.photo_75;
                    }
                    out.push(u);
                }
                return out;
            }
            return null;
        });
    }

    public Login(headers: any): Observable<boolean> {
        return this.httpClient.post('/api/login', headers).map((res: any) => res.NewUser);
    }

    public GetCalculator(id: number): Observable<any> {
        return this.httpClient.get('/api/calc/' + id + '/get').map((res: any) => {
            if (res.Item) {
                const item = res.Item;
                return {
                    id: item.id,
                    type: item.type,
                    userId: item.user_id,
                    subjectId: item.subject_id,
                    schema: item.contents
                };
            }
        });
    }

    public UpdateCalculator(id: number, type: number,
        subjectId: number, schema: string, headers: any): Observable<boolean> {

        return this.httpClient.put('/api/calc/' + id + '/modify', {
            'Id': id,
            'Type': type,
            'SubjectId': subjectId,
            'Contents': schema
        }, { 'headers': headers }).map((resp: any) => {
            if (resp) {
                return resp.Success;
            }
        });
    }

    public CreateCalculator(type: number,
        subjectId: number, schema: string, headers: any): Observable<number> {

        return this.httpClient.post('/api/calc/create', {
            'Type': type,
            'SubjectId': subjectId,
            'Contents': schema
        }, { 'headers': headers }).map((res: any) => res.Id);
    }

    public DeleteCalculator(id: number, headers: any): Observable<void> {
        return this.httpClient.delete('/api/calc/' + id + '/delete',
            { 'headers': headers }).map((res: any) => {
                if (!res.Success) {
                    throw new Error();
                }
            });
    }

    public GetHierarchy(): Observable<any> {
        return this.httpClient.get('/api/hierarchy');
    }

    public GetList(subjectId: number): Observable<any[]> {
        return this.httpClient.get('/api/subject/' + subjectId + '/list_schemas').
            map((res: any) => res.subject.schemas);
    }

    public GetProfileData(headers: any): Observable<any> {
        return this.httpClient.get('/api/profile', { 'headers': headers });
    }

    public UpdateProfileData(updates: any, headers: any): Observable<void> {
        return this.httpClient.put('/api/profile/update',
            updates, { 'headers': headers, 'observe': 'response' }).
            map((res: any) => {
                if (res !== 200) {
                    throw new Error();
                }
            });
    }
}
