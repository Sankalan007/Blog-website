import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Post from 'src/app/model/Post';
import { PostserviceService } from 'src/app/services/postservice.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

@Component({
  selector: 'app-postdetail',
  templateUrl: './postdetail.component.html',
  styleUrls: ['./postdetail.component.css'],
})
export class PostdetailComponent implements OnInit {
  post: Post = {} as Post;
  views: number[] = [];
  viewCount: number = 0;
  constructor(
    private route: ActivatedRoute,
    private postService: PostserviceService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPost(id).subscribe(
      (res) => {
        this.post = res;
      },
      (error) => {
        alert(error.message);
      }
    );
    this.sharedDataService.viewsObservable.subscribe((views) => {
      this.views = views;
    });
    this.viewCount = this.views.length;
  }

  formatDate(input: string): string {
    if (!input) {
      return '';
    }
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
