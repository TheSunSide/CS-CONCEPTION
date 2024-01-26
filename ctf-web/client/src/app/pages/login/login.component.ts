import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/service/http-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor(private router: Router, private http: HttpServiceService) {}

  ngOnInit(): void {}

  async onSubmit() {
    console.log('submitting: ', this.loginForm.value);
    this.http.login(this.loginForm.value).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/posts']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async onRegister() {
    console.log(this.registerForm.value);
    const rep = await fetch('http://localhost:4200/api/new-user', {
      method: 'POST',
      body: JSON.stringify(this.registerForm.value),
      headers: { mode: 'cors' },
    });
    if (rep.status === 200) {
      console.log('success');
      this.router.navigate(['/posts']);
    } else {
    }
  }
}
