import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<HttpResponse<any>>('http://localhost:4200/api/posts');
  }

  login(data: any) {
    return this.http.post<HttpResponse<string>>(
      'http://localhost:4200/api/login',
      data
    );
  }

  register(data: any) {
    return firstValueFrom(
      this.http.post<HttpResponse<any>>(
        'http://localhost:4200/api/new-user',
        data
      )
    );
  }

  postPost(data: any) {
    return this.http.post<HttpResponse<any>>(
      'http://localhost:4200/api/new-post',
      data
    );
  }

  getUsers(data: any) {
    return firstValueFrom(
      this.http.get<HttpResponse<any>>(
        'http://localhost:4200/api/users?id=' + data
      )
    );
  }

  getFlag() {
    return firstValueFrom(
      this.http.get<HttpResponse<any>>('http://localhost:4200/api/flag')
    );
  }
}
