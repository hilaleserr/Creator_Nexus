import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Dil durumu: varsayılan Türkçe ('TR')
  currentLang: 'TR' | 'EN' = (localStorage.getItem('nexus_lang') as 'TR' | 'EN') || 'TR';

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'TR' ? 'EN' : 'TR';
    localStorage.setItem('nexus_lang', this.currentLang);
    window.dispatchEvent(new Event('languageChange'));
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}