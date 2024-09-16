import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-feed',
  templateUrl: './home-feed.component.html',
  styleUrls: ['./home-feed.component.css']
})
export class HomeFeedComponent implements OnInit {
  videos: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchVideos();
  }

  fetchVideos() {
    this.http.get('https://streamflix.koyeb.app/api/v1/videos/stream').subscribe({
      next: (data: any) => {
        this.videos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
        this.toastr.error('Error fetching videos');
        this.loading = false;
      }
    });
  }

  handleDelete(id: string) {
    this.http.get(`https://streamflix.koyeb.app/api/v1/videos/stream/delete/${id}`).subscribe({
      next: () => {
        this.videos = this.videos.filter(video => video.videoId !== id);
        this.toastr.success('Video deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting video:', error);
        this.toastr.error('Error deleting video');
      }
    });
  }
}
