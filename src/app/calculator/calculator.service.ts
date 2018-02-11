import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class CalculatorService {
    public Schema: any = {};
    private nodeReferences: any = {};

    public constructor(private http: HttpClient) { }

    /*
        public Load(id: any): Observable<boolean> {
            if (isNaN(id) || (+id < 1)) {
                return Observable.of(false);
            }
            const cid = +id;
            if (this.cache[cid]) {
                this.schema = this.cache[cid];
                return Observable.of(false);
            }
            return this.http.get(Globals.SiteUrl + 'schema/' + cid)
                .map((s) => {
                    this.schema = s;
                    return true;
                }, _ => false);
        }
    */
    public Load(id: any) {
        this.Schema = JSON.parse(`{
            "program_id": 0,
            "subject_id": 0,
            "year": 0,
            "calculator": [
                {
                    "name": "Nakop",
                    "multiplier": 0.6,
                    "id": 1,
                    "actions": [
                        {
                            "action": "condition",
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
                                    "first_operand": "1",
                                    "operator": "*",
                                    "second_operand": 0.8
                                }
                            ],
                            "else": []
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
                            ],
                            "sub": []
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
                            ],
                            "sub": []
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
                            ],
                            "sub": []
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
                            ],
                            "sub": []
                        }
                    ]
                },
                {
                    "name": "Exam",
                    "multiplier": 0.4,
                    "id": 6,
                    "actions": [
                        {
                            "action": "conditional",
                            "if": {
                                "action": "and",
                                "expression": [
                                    {
                                        "action": "condition",
                                        "first_operand": "6",
                                        "operator": "!=",
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
                                    "action": "decorate",
                                    "first_operand": "1",
                                    "operator": "/",
                                    "second_operand": 0.6
                                }
                            ]
                        }
                    ],
                    "sub": []
                }
            ]
        }`);
        this.nodeReferences = {};
        this.init(this.Schema);
    }

    public Execute(node_id: number): number {
        return 0;
    }

    private init(schema: any): void {
        if (schema.hasOwnProperty('calculator')) {
            for (const part of schema.calculator) {
                this.init(part);
            }
        } else {
            if (schema.hasOwnProperty('id')) {
                this.nodeReferences[schema.id] = schema;
                if (!schema.sub || !schema.sub.length) {
                    schema.value = 4;
                } else {
                    for (const part of schema.sub) {
                        this.init(part);
                    }
                }
            }
        }
    }
}
