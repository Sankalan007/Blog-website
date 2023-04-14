import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, map, share, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Post from 'src/app/model/Post';
import { AuthService } from 'src/app/services/auth.service';
import { PostserviceService } from 'src/app/services/postservice.service';
import { SharedDataService } from 'src/app/services/shareddata.service';
import View from 'src/app/model/View';
import { ViewService } from 'src/app/services/view.service';

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
  views: number[] = [];
  viewMap: Map<number, number> = new Map();
  viewCount: number[] = [];
  uniqueViews: number = 0;

  constructor(
    private sharedDataService: SharedDataService,
    private postService: PostserviceService,
    private modalService: NgbModal,
    private authService: AuthService,
    private viewService: ViewService
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

  // This function takes in a postId as a number and returns an Observable of number type
  getViews(postId: number): Observable<number> {
    // It makes a call to the getViewers() function of the viewService with the postId as argument
    return this.viewService.getViewers(postId).pipe(
      // The pipe function allows you to chain RxJS operators together
      // The tap operator allows you to perform side effects such as logging, without modifying the data stream
      tap((res: number[]) => {
        // In this case, we're setting some properties on the current object based on the result of the viewService call
        // We're setting the views property to the result array
        this.views = res;
        // We're also setting the viewCount property to the result array
        this.viewCount = res;
        // And finally, we're setting the uniqueViews property to the length of the result array, giving us the number of unique viewers
        this.uniqueViews = res.length;
      }),
      // The map operator allows you to transform the data stream in some way
      // In this case, we're simply returning the value of the uniqueViews property as a number
      map(() => this.uniqueViews)
    );
  }

  onView(postId: number) {
    let view: View = {
      postId: postId,
      userId: this.userDetails.id,
      viewedOn: new Date().toISOString(),
    };
    if (this.isAuthenticated()) {
      this.viewService.addViewer(view).subscribe(
        (res) => {
          this.getViews(postId).subscribe((uniqueViews) => {
            this.viewMap.set(postId, uniqueViews);
            this.sharedDataService.updateViews(this.views);
          });
        },
        (error) => {
          alert(error.message);
        }
      );
    }
    // this.router.navigate(['/posts', postId]);
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
