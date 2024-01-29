import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<HttpResponse<any>>('/api/posts');
  }

  getPostsWithScope(id: string) {
    return this.http.get<HttpResponse<any>>('/api/checkposts', {
      params: { id: id },
      observe: 'response',
    });
  }

  login(data: any) {
    return this.http.post<HttpResponse<string>>('/api/login', data);
  }

  register(data: any) {
    return firstValueFrom(
      this.http.post<HttpResponse<any>>('/api/new-user', data)
    );
  }

  postPost(data: any) {
    return this.http.post<HttpResponse<any>>('/api/new-post', data);
  }

  getUsers(data: any) {
    return firstValueFrom(
      this.http.get<HttpResponse<any>>('/api/users?id=' + data)
    );
  }

  getFlag() {
    return firstValueFrom(this.http.get<HttpResponse<any>>('/api/flag'));
  }

  resetDB() {
    return this.http.post<HttpResponse<any>>('/api/reset', {});
  }
}
