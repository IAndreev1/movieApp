import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "express";
import {AuthService} from "../../services/auth.service";




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: UntypedFormGroup;
  submitted = false;
  error = false;
  errorMessage = '';

  constructor(private formBuilder: UntypedFormBuilder, private authService: AuthService, private router: Router, private notification: Sweeta) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2 : ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  registerUser() {
    this.submitted = true;

    if(this.registerForm.controls.password.value != this.registerForm.controls.password2.value) {
      this.notification.error("Passwords don't match!")
    } else {
      const userDetail: UserDetail = new UserDetail(null,this.registerForm.controls.firstName.value,this.registerForm.controls.lastName.value,  this.registerForm.controls.email.value,null, this.registerForm.controls.password.value,null, 0);
      console.log(userDetail)
      this.authService.registerUser(userDetail).subscribe({
        next: () => {
          console.log('Successfully registered user: ' + userDetail.email);
          this.router.navigate(['']);
        },
        error: error => {
          console.log('Could not register due to:');
          let firstBracket = error.error.indexOf('[');
          let lastBracket = error.error.indexOf(']');
          let errorMessages = error.error.substring(firstBracket + 1, lastBracket).split(',');
          let errorDescription = error.error.substring(0, firstBracket);
          errorMessages.forEach(message => {
            this.notification.error(message, "Could not register user " + userDetail.email);
          });
        }
      });
    }



  }

  vanishError() {
    this.error = false;
  }

  ngOnInit(): void {
  }
}