import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecaptchaModule } from 'ng-recaptcha'; // reCAPTCHA eklendi

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode: boolean = true;
  
  email: string = '';
  password: string = '';
  fullName: string = '';
  title: string = '';
  skills: string = '';
  
  captchaToken: string | null = null; // Robot testinin sonucu

  errorMessage: string = '';
  successMessage: string = '';

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.captchaToken = null;
  }

  // Captcha tamamlandığında çalışır
  resolved(captchaResponse: string | null) {
    this.captchaToken = captchaResponse;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // 1. Manuel Doğrulama (Boşluk Kontrolü)
    if (!this.email || !this.password) {
      this.errorMessage = 'Lütfen e-posta ve şifrenizi girin.';
      return;
    }

    // 2. E-posta Format Kontrolü (Regex) - Sistemin geçersiz mailleri engellediği yer
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Lütfen geçerli bir e-posta adresi girin (örn: isim@domain.com).';
      return;
    }

    if (this.isLoginMode) {
      // GİRİŞ YAP
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.successMessage = 'Giriş başarılı! Yönlendiriliyorsunuz...';
          setTimeout(() => this.router.navigate(['/discover']), 1000);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'E-posta veya şifre hatalı.';
        }
      });
    } else {
      // KAYIT OL
      if (!this.fullName) {
        this.errorMessage = 'Kayıt olmak için Ad Soyad girmelisiniz.';
        return;
      }
      if (!this.captchaToken) {
        this.errorMessage = 'Lütfen robot olmadığınızı doğrulayın.';
        return;
      }

      const payload = {
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        title: this.title,
        skills: this.skills
      };
      
      this.authService.register(payload).subscribe({
        next: () => {
          this.successMessage = 'Kayıt başarılı! Lütfen doğrulama için e-postanıza gidin.';
          setTimeout(() => this.toggleMode(), 2500);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Kayıt olurken bir hata oluştu.';
        }
      });
    }
  }

  loginWithGoogle(): void {
    alert('Google API ayarlarını bir sonraki adımda bağlayacağız.');
  }

  loginWithGithub(): void {
    alert('GitHub API ayarlarını bir sonraki adımda bağlayacağız.');
  }
}