import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import View from '../model/View';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  viewers: number[] = [];

  private baseUrl = 'http://localhost:8080/api/v1/views';

  constructor(private http: HttpClient) {}

  getViewers(postId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/unique/${postId}`);
  }

  addViewer(view: View): Observable<View> {
    return this.http.post<View>(`${this.baseUrl}/add`, view);
  }
}
