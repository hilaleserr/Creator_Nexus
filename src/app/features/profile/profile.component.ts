import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html', // Sadece .html yazıyorsa .component.html yap
  styleUrl: './profile.component.scss'     // Sadece .scss yazıyorsa .component.scss yap
})
export class ProfileComponent { }