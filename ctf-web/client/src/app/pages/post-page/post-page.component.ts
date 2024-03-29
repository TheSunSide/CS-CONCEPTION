import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpServiceService } from 'src/app/service/http-service.service';
import { debounceTime, takeUntil } from 'rxjs/operators';

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
  private readonly debounceTimeMs = 300;

  private searchSubject = new Subject<string>();
  search: string = '';
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
    this.updatePosts();
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((searchValue) => {
        this.getPosts(searchValue);
      });
  }

  onSearch() {
    this.searchSubject.next(this.search);
  }

  getPosts(value: string) {
    this.http.getPostsWithScope(value).subscribe(
      (res) => {
        if (res.status === 206) {
          console.log('ERROR: KINDA', res);
          return;
        }
        console.log(res);
        const obj: any = res.body;
        if (Array.isArray(res)) {
          this.posts = obj[obj.length - 1].rows as unknown as {
            id: number;
            content: string;
            title: string;
            author: number;
          }[];
        } else {
          this.posts = obj.rows as unknown as {
            id: number;
            content: string;
            title: string;
            author: number;
          }[];
        }

        setTimeout(() => {
          for (let i = 0; i < this.posts.length; i++) {
            let elem;
            if (this.posts[i].content.includes('script')) {
              elem = document.createElement('script');
              // Strip the script tags from the content
              const val = this.posts[i].content
                .replace(/<script>/g, '')
                .replace(/<\/script>/g, '');
              elem.textContent = val;
              document.getElementById('post' + i)?.appendChild(elem);
              continue;
            }
            elem = document.createElement('div');
            elem.innerHTML = this.posts[i].content;
            document.getElementById('post' + i)?.appendChild(elem);
          }
          console.log(this.posts);
        }, 1000);
      },
      (err) => {
        console.log(err);
        console.log('Error On Search');
      }
    );
  }

  updatePosts() {
    this.http.getPosts().subscribe(
      async (res) => {
        console.log(res);
        this.posts = res as unknown as {
          id: number;
          content: string;
          title: string;
          author: number;
        }[];
        setTimeout(() => {
          for (let i = 0; i < this.posts.length; i++) {
            let elem;
            if (this.posts[i].content.includes('script')) {
              elem = document.createElement('script');
              // Strip the script tags from the content
              const val = this.posts[i].content
                .replace(/<script>/g, '')
                .replace(/<\/script>/g, '');
              elem.textContent = val;
              document.getElementById('post' + i)?.appendChild(elem);
              continue;
            }
            elem = document.createElement('div');
            elem.innerHTML = this.posts[i].content;
            document.getElementById('post' + i)?.appendChild(elem);
          }
          console.log(this.posts);
        }, 1000);
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
