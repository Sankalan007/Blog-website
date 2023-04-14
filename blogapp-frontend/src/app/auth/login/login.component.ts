import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shareddata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  userDetails: any = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe(
      (response: any) => {
        // login successful, save token to local storage and retrieve user details
        localStorage.setItem('token', response.token);
        this.toastr.success('Yay! You are logged in.', 'Login successful');
        this.authService.getUserDetails().subscribe(
          (user: any) => {
            this.sharedDataService.setUserDetails(user);
            this.userDetails = user;
          },
          (error) => {
            this.toastr.error(
              'Please try again later.',
              'Something went wrong'
            );
          }
        );

        this.router.navigate(['/']);
        // location.reload();
        console.log('Login successful');
        console.log(response);
      },
      (error) => {
        // login failed, show error message
        this.toastr.error('Please try again later.', 'Something went wrong');
      }
    );
    // this.router.navigate(['/']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
