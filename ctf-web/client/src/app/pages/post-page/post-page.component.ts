import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/service/http-service.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent implements OnInit {
  constructor(
    private http: HttpServiceService,
    private router: Router,
    private sanitize: DomSanitizer
  ) {}
  posts: { id: number; content: string; title: string; author: number }[] = [];
  isConnected: boolean = false;
  id?: string;
  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });
  ngOnInit(): void {
    const cookie = document.cookie.split(';').find((cookie) => {
      return cookie.includes('id');
    });
    if (cookie) {
      this.isConnected = true;
      this.id = cookie.split('=')[1];
    }
    this.http.getPosts().subscribe(
      (res) => {
        console.log(res);
        this.posts = res as unknown as {
          id: number;
          content: string;
          title: string;
          author: number;
        }[];
        for (let i = 0; i < this.posts.length; i++) {
          this.posts[i].content = this.sanitize.bypassSecurityTrustHtml(
            this.posts[i].content
          ) as string;
        }
        console.log(this.posts);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.http
        .postPost({
          title: this.postForm.value.title,
          content: this.postForm.value.content,
          id: this.id,
        })
        .subscribe(
          (res) => {
            console.log(res);
            this.ngOnInit();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}
