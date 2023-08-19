import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  error: any = null;
  visiblePassword: boolean = false;

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
    this.error = null;
    if (form.valid) {
      // Process form data
      console.log(this.formData);
      this.auth.register(this.formData).then((res: any) => {
        if(res.status) {
          this.router.navigate(['login']);
        } else {
          this.error = res.message;
        }
      }).catch(e => {
        console.log(e);
        this.error = "Something went wrong";
      })
    }
  }
}
