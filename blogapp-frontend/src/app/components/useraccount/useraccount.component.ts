import { Component, OnInit } from '@angular/core';
import User from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-useraccount',
  templateUrl: './useraccount.component.html',
  styleUrls: ['./useraccount.component.css'],
})
export class UseraccountComponent implements OnInit {
  userDetails!: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUserDetails().subscribe(
      (res) => {
        this.userDetails = res;
      },
      (error) => {
        alert(error.message);
      }
    );
  }
}
