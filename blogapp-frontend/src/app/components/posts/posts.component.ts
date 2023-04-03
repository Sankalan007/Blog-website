import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostserviceService } from 'src/app/services/postservice.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

import Post from '../../model/Post';
import { AuthService } from 'src/app/services/auth.service';
import { ViewService } from 'src/app/services/view.service';
import View from 'src/app/model/View';
import { Router } from '@angular/router';
import { Observable, forkJoin, map, tap } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @ViewChild('editModal') editM: any;
  @ViewChild('deleteModal') deleteModal: any;

  userDetails!: any;
  trimmed: boolean = false;
  posts: Post[] = [];
  editPost: Post = {} as Post;
  deletePost: Post = {} as Post;
  views: number[] = [];
  viewMap: Map<number, number> = new Map();
  viewCount: number[] = [];
  uniqueViews: number = 0;

  view!: View;

  constructor(
    private postService: PostserviceService,
    private sharedDataService: SharedDataService,
    private modalService: NgbModal,
    private authService: AuthService,
    private viewService: ViewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sharedDataService.postsObservable.subscribe((posts) => {
      this.posts = posts;

      const observables = this.posts.map((post) =>
        this.getViews(post.id).pipe(
          map((uniqueViews) => [post.id, uniqueViews])
        )
      );

      forkJoin(observables).subscribe((results) => {
        this.viewMap = new Map<number, number>(
          results.map(([postId, uniqueViews]) => [postId, uniqueViews])
        );
      });
    });

    this.sharedDataService.userDetails$.subscribe((userDetails) => {
      this.userDetails = userDetails;
    });

    this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(
      (res: Post[]) => {
        this.posts = res;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  getViews(postId: number): Observable<number> {
    return this.viewService.getViewers(postId).pipe(
      tap((res: number[]) => {
        this.views = res;
        this.viewCount = res;
        this.uniqueViews = res.length;
      }),
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
