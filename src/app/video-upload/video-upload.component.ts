import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent implements OnInit {
  selectedFile: File | null = null;
  selectedImg: File | null = null;
  progress: number = 0;
  uploading: boolean = false;
  message: string = '';
  videoForm: FormGroup;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
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

  ngOnInit(): void {
    // this.visitorPersistentBySession();
    this.visitorPersistentByCookie();
  }

  visitorPersistentBySession() {
    const visitorIP = sessionStorage.getItem('visitorIP');

    if (!visitorIP) {
      this.http.get("https://streamflix.koyeb.app/api/v1/visitor/save", { responseType: 'text' }).subscribe((responseMsg) => {
        sessionStorage.setItem('visitorIP', responseMsg);
        console.log("Visitor IP : " + responseMsg);
      });
    } else {
      console.log("Visitor Exists With IP : " + visitorIP);
    }
  }

  visitorPersistentByCookie() {
    const visitorIP = this.cookieService.get('visitorIP');

    if (!visitorIP) {
      this.http.get("https://streamflix.koyeb.app/api/v1/visitor/save", { responseType: 'text' }).subscribe((responseMsg) => {
        this.cookieService.set('visitorIP', responseMsg, 10); // 10-day expiry
        console.log("Visitor IP : " + responseMsg);
      });
    } else {
      console.log("Visitor Exists With IP : " + visitorIP);
    }
  }

  handleFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  handleImgChange(event: any) {
    this.selectedImg = event.target.files[0];
  }

  dismissMessage() {
    this.message = ''; // Clear the message
  }


  handleForm() {

    // Check if title is valid
    if (!this.videoForm.get('title')?.value) {
      this.toastr.warning('Title is required !', '', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    // Check if description is valid
    if (!this.videoForm.get('desc')?.value) {
      this.toastr.info('Description is required !', '', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    // Validate selected video file
    if (!this.selectedFile || this.selectedFile.type.split('/')[0] !== 'video') {
      this.toastr.error('Invalid video file !', '', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    // Validate selected thumbnail image
    if (!this.selectedImg || this.selectedImg.type.split('/')[0] !== 'image') {
      this.toastr.warning('Invalid image file !', '', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    // Proceed to submit if all validations pass
    this.submitToServer(this.selectedFile, this.selectedImg, this.videoForm.value);
  }


  resetForm() {
    this.videoForm.reset();
    this.uploading = false;
    this.progress = 0;
    this.selectedFile = null;
    this.selectedImg = null;
    // Clear the file input values manually
    const fileInput = document.querySelector('input[type="file"][name="file"]') as HTMLInputElement;
    const imgInput = document.querySelector('input[type="file"][name="thumb"]') as HTMLInputElement;

    if (fileInput) fileInput.value = ''; // Clear the video file input
    if (imgInput) imgInput.value = ''; // Clear the image thumbnail input
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
          this.toastr.success('Hurrey! File Uploading Done', '', {
            timeOut: 3000,
            positionClass: 'toast-top-center',
          });
        }
      },
      error: (err) => {
        this.resetForm();
        this.message = 'Oops... Uploading Failed!';
        this.toastr.error('Bad Luck!', '', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
        console.error(err);
      }
    });
  }
}
