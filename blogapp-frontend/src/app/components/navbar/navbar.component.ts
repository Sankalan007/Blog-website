import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('dropdown') dropdown!: ElementRef;

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
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.getPosts();
    // document.addEventListener('click', this.closeDropdown.bind(this));
  }

  // ngOnDestroy() {
  //   document.removeEventListener('click', this.closeDropdown.bind(this));
  // }

  // closeDropdown(event: MouseEvent) {
  //   if (
  //     this.showDropdown &&
  //     !this.dropdown.nativeElement.contains(event.target)
  //   ) {
  //     this.showDropdown = false;
  //   }
  // }

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
    this.showDropdown = !this.showDropdown;
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
    if (!key) this.getPosts();
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
    this.router.navigate(['/']);
  }

  openAddModal() {
    if (this.isAuthenticated()) this.modalService.open(this.addModal);
    else this.showAlert();
  }

  closeAddModal() {
    this.modalService.dismissAll();
  }
}
