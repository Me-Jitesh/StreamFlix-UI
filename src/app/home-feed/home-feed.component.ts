import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-feed',
  templateUrl: './home-feed.component.html',
  styleUrls: ['./home-feed.component.css']
})
export class HomeFeedComponent implements OnInit {
  videos: any[] = [];
  loading = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchVideos();
  }

  fetchVideos() {
    this.http.get('https://streamflix.koyeb.app/api/v1/videos/stream').subscribe({
      next: (data: any) => {
        this.videos = data;
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  handleDelete(id: string) {
    this.http.get(`https://streamflix.koyeb.app/api/v1/videos/stream/delete/${id}`).subscribe({
      next: () => {
        this.videos = this.videos.filter(video => video.videoId !== id);
      },
      error: (error) => {
        console.error('Error deleting video:', error);
      }
    });
  }
}
