import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  currentUser: any = null;

  // Örnek Dashboard İstatistikleri ve Kullanıcı Projeleri
  stats = {
    activeProjects: 2,
    teamApplications: 5,
    matchRate: '%91'
  };

  myProjects = [
    {
      id: 1,
      title: 'AI Image Organizer',
      category: 'AI',
      status: 'Aktif',
      teamSize: '2/4 Üye',
      matchScore: 94
    },
    {
      id: 2,
      title: 'Smart Campus App',
      category: 'Mobile',
      status: 'Arge Aşamasında',
      teamSize: '3/5 Üye',
      matchScore: 88
    }
  ];

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }
}