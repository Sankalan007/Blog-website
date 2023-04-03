import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Post from '../model/Post';
import View from '../model/View';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  defaultView: View = {
    postId: 0,
    userId: 0,
    viewedOn: '',
  };

  private postsSubject = new BehaviorSubject<Post[]>([]);
  public postsObservable = this.postsSubject.asObservable();

  private userDetailsSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('userDetails') as string)
  );
  userDetails$ = this.userDetailsSubject.asObservable();

  private viewsSubject = new BehaviorSubject<number[]>([]);
  public viewsObservable = this.viewsSubject.asObservable();

  updatePosts(posts: Post[]): void {
    this.postsSubject.next(posts);
  }

  setUserDetails(userDetails: any): void {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.userDetailsSubject.next(userDetails);
  }

  updateViews(views: number[]): void {
    this.viewsSubject.next(views);
  }
}
