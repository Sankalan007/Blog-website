import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Post from '../model/Post';

@Injectable({
  providedIn: 'root',
})
export class PostserviceService {
  private baseUrl = 'http://localhost:8080/api/v1/posts';

  constructor(private http: HttpClient) {}

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/findByPostId/${postId}`);
  }

  getPostByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/findByUserId/${userId}`);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/all/sortedBy/updatedOn`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/add`, post);
  }

  updatePost(post: Post, postId: number): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/update/${postId}`, post);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${postId}`);
  }
}
