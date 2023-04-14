import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage!: String;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: ['', [Validators.required, this.checkTerms.bind(this)]],
    });
  }

  checkTerms(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          this.toastr.success('Please log in', 'Registration successful');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastr.error(
            'Username or Email already exists!',
            'Registration failed!'
          );
        }
      );
    } else {
      this.toastr.warning(
        'Please fill all the fields accordingly',
        'Invalid form'
      );
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
