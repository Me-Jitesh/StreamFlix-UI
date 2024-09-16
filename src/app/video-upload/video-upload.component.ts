import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent {
  selectedFile: File | null = null;
  selectedImg: File | null = null;
  title: string = '';
  description: string = '';
  progress: number = 0;
  uploading: boolean = false;
  message: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onImgChange(event: any) {
    this.selectedImg = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile || !this.selectedImg) {
      alert('Must Select Video File!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('thumb', this.selectedImg);
    formData.append('title', this.title);
    formData.append('desc', this.description);

    this.uploading = true;
    this.http.post('https://streamflix.koyeb.app/api/v1/videos', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            }
            break;
          case HttpEventType.Response:
            this.uploading = false;
            this.message = 'File Uploaded Successfully!';
            this.toastr.success('Hooray! File Uploading Done');
            this.resetForm();
            break;
        }
      }),
      catchError(error => {
        this.uploading = false;
        this.message = 'Oops... Uploading Failed!';
        this.toastr.error('Bad Luck!');
        console.error(error);
        return of(null);
      })
    ).subscribe();
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedFile = null;
    this.selectedImg = null;
    this.progress = 0;
  }
}
