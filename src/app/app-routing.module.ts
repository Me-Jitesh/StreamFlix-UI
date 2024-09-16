import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { HomeFeedComponent } from './home-feed/home-feed.component';

const routes: Routes = [
  { path: '', redirectTo: '/video-upload', pathMatch: 'full' },
  { path: 'video-upload', component: VideoUploadComponent },
  { path: 'home-feed', component: HomeFeedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
