import { Component } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent {
  selectedFile: File | null = null;
  selectedImg: File | null = null;
  progress: number = 0;
  uploading: boolean = false;
  message: string = '';
  vidId: string = "694543b0-7a1b-4bb5-9d2d-59c0624b0a2c";
  videoForm: FormGroup;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      file: [null, Validators.required],
      thumb: [null, Validators.required]
    });
  }

  handleFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  handleImgChange(event: any) {
    this.selectedImg = event.target.files[0];
  }

  handleForm() {
    if (!this.selectedFile || !this.selectedImg) {
      alert('Must Select Video and Thumbnail!');
      return;
    }
    this.submitToServer(this.selectedFile, this.selectedImg, this.videoForm.value);
  }

  resetForm() {
    this.videoForm.reset();
    this.uploading = false;
    this.progress = 0;
    this.selectedFile = null;
    this.selectedImg = null;
  }

  submitToServer(video: File, image: File, videoMeta: any) {
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', video);
    formData.append('thumb', image);
    formData.append('title', videoMeta.title);
    formData.append('desc', videoMeta.desc);

    this.http.post('https://streamflix.koyeb.app/api/v1/videos', formData, {
      reportProgress: true,
      observe: 'events',
    }).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * (event.loaded / (event.total || 1)));
        } else if (event.type === HttpEventType.Response) {
          this.resetForm();
          this.message = 'File Uploaded Successfully!';
          this.toastr.success('Hurrey! File Uploading Done');
        }
      },
      error: (err) => {
        this.resetForm();
        this.message = 'Oops... Uploading Failed!';
        this.toastr.error('Bad Luck!');
        console.error(err);
      }
    });
  }
}
