import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent {
  @Input() video: any;
  @Output() onDelete = new EventEmitter<string>();
}
