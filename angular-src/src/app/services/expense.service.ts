import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class ExpenseService {
  authToken: any;
  user: any;

  constructor(private http: Http) { }

  sendExpense(user) {
    let headers = new Headers();
    headers.append('Id', this.user.id);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/expenses', user, {headers: headers})
    .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

}
