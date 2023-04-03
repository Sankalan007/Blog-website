import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { share } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Post from 'src/app/model/Post';
import { AuthService } from 'src/app/services/auth.service';
import { PostserviceService } from 'src/app/services/postservice.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

@Component({
  selector: 'app-userblogs',
  templateUrl: './userblogs.component.html',
  styleUrls: ['./userblogs.component.css'],
})
export class UserblogsComponent implements OnInit {
  @ViewChild('editModal') editM: any;
  @ViewChild('deleteModal') deleteModal: any;

  userDetails!: any;
  posts: Post[] = [];
  trimmed: boolean = false;
  editPost: Post = {} as Post;
  deletePost: Post = {} as Post;

  constructor(
    private sharedDataService: SharedDataService,
    private postService: PostserviceService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sharedDataService.userDetails$.subscribe((userDetails) => {
      this.userDetails = userDetails;
    });
    this.getPosts();
    console.log(this.userDetails.id);
    console.log(this.posts);
  }

  getPosts(): void {
    this.postService.getPostByUserId(this.userDetails.id).subscribe(
      (res: Post[]) => {
        this.posts = res;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  openEditModal(post: Post) {
    this.editPost = post;
    this.modalService.open(this.editM);
  }

  closeEditModal() {
    this.modalService.dismissAll();
  }

  onUpdatePost(post: Post, postId: number) {
    document.getElementById('close-edit-post')?.click();
    post.updatedOn = new Date().toISOString();
    this.postService.updatePost(post, postId).subscribe(
      (res) => {
        this.getPosts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  openDeleteModal(post: Post) {
    this.deletePost = post;
    this.modalService.open(this.deleteModal);
  }

  closeDeleteModal() {
    this.modalService.dismissAll();
  }

  onDeletePost(postId: number) {
    document.getElementById('delete-cancel-button')?.click();
    this.postService.deletePost(postId).subscribe(
      (res: void) => {
        this.getPosts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  trimTitle(text: string): string {
    if (text.length <= 80) {
      return text;
    } else {
      this.trimmed = true;
      return text.substring(0, 80).trim() + '...';
    }
  }

  trimContent(text: string): string {
    if (text.length <= 200) {
      return text;
    } else {
      this.trimmed = true;
      return text.substring(0, 200).trim() + '...';
    }
  }

  isTrimmed() {
    return this.trimmed;
  }

  getCurrentTime() {
    return new Date();
  }

  formatDate(input: string): string {
    let [date, time] = input.split('T');
    let [year, month, day] = date.split('-');
    let [hour, minute, second] = time
      .slice(0, -1)
      .split(':')
      .map((str) => parseInt(str, 10));
    let formattedHour = hour + 5;
    if (formattedHour >= 24) {
      formattedHour -= 24;
      const nextDay = new Date(
        Date.UTC(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10) + 1
        )
      );
      year = nextDay.getUTCFullYear().toString();
      month = (nextDay.getUTCMonth() + 1).toString().padStart(2, '0');
      day = nextDay.getUTCDate().toString().padStart(2, '0');
    }
    let formattedMinute = minute + 30;
    if (formattedMinute >= 60) {
      formattedMinute -= 60;
      formattedHour += 1;
    }
    const period = formattedHour >= 12 ? 'pm' : 'am';
    formattedHour = formattedHour % 12;
    formattedHour = formattedHour === 0 ? 12 : formattedHour;
    const formattedDate = `${parseInt(day, 10)}${this.getOrdinalSuffix(
      parseInt(day, 10)
    )} ${this.getMonthName(
      parseInt(month, 10)
    )} ${year} ${formattedHour}:${formattedMinute
      .toString()
      .padStart(2, '0')} ${period}`;
    return formattedDate;
  }

  getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  getMonthName(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }
}
