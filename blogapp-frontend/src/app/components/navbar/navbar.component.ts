import { Component, OnInit, ViewChild } from '@angular/core';
import Post from 'src/app/model/Post';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostserviceService } from 'src/app/services/postservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/services/shareddata.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @ViewChild('addModal') addModal: any;
  userDetails!: any;
  posts!: Post[];
  addForm!: FormGroup;
  showAlertContent: boolean = false;
  dropdownOpen: boolean = false;
  showDropdown: boolean = false;

  constructor(
    private postService: PostserviceService,
    private modalService: NgbModal,
    private sharedDataService: SharedDataService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sharedDataService.userDetails$.subscribe((userDetails) => {
      this.userDetails = userDetails;
    });
    this.addForm = this.fb.group({
      author: [this.userDetails.userName],
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.getPosts();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logOut() {
    this.authService.logout();
    this.sharedDataService.setUserDetails('');
  }

  showAlert() {
    this.showAlertContent = true;
  }

  hideAlert() {
    this.showAlertContent = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.showDropdown = this.dropdownOpen;
  }

  searchPosts(key: string) {
    console.log(key);

    const results: Post[] = [];
    for (const post of this.posts) {
      if (
        post.title.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        post.content.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        post.author.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        post.createdOn.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        post.updatedOn.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(post);
      }
      console.log(results);
    }
    this.posts = results;
    this.sharedDataService.updatePosts(this.posts);
    if (results.length == 0 || !key) this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(
      (res: Post[]) => {
        this.posts = res;
        this.sharedDataService.updatePosts(this.posts);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onAddPost(post: Post): void {
    document.getElementById('close-add-post')?.click();
    this.addForm = this.fb.group({
      author: [''],
      title: [''],
      content: [''],
    });
    post.author = this.userDetails.userName;
    post.createdOn = new Date().toISOString();
    post.updatedOn = post.createdOn;
    post.userId = this.userDetails.id;
    this.postService.createPost(post).subscribe(
      (res: Post) => {
        this.getPosts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  openAddModal() {
    if (this.isAuthenticated()) this.modalService.open(this.addModal);
    else this.showAlert();
  }

  closeAddModal() {
    this.modalService.dismissAll();
  }
}
