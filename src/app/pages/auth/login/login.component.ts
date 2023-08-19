import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  error: any = null;

  formData = {
    email: '',
    password: ''
  }
  validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Invalid email address.'
    },
    password: {
      required: 'Password is required.',
      minlength: 'Password must be at least 6 characters long.'
    }
  };
  constructor(private auth: AuthService, private router: Router) { }

  submitForm(form: NgForm) {
    if (form.valid) {
      // Process form data
      this.error = null;
      console.log(this.formData);
      this.auth.login(this.formData.email, this.formData.password).then((res: any) => {
        console.log(res);
        if(res.status) {
          this.router.navigate(['/']);
        } else {
          this.error = res.message;
        }
      }).catch(e => {
        console.log(e);
        this.error = "Something went wrong";
      })
    }
  }

  ngOnInit() {
    this.auth.getUsers().then(res => {
      console.log(res);
    }).catch(e => {
      console.log(e);
    })
  }

}
