import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// GlassCard bileşenini içeri aktarıyoruz:
import { GlassCardComponent } from '../../shared/ui/glass-card/glass-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  // Component'in imports dizisine ekliyoruz:
  imports: [CommonModule, RouterLink, GlassCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }