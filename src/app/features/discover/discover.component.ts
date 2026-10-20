import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  description: string;
  matchScore: number;
  lookingFor: string[];
  skills: string[];
  owner: string;
  teamSize: string;
}

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discover.html',
  styleUrl: './discover.scss'
})
export class DiscoverComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  lang: 'TR' | 'EN' = (localStorage.getItem('nexus_lang') as 'TR' | 'EN') || 'TR';
  private langListener = () => {
    this.lang = (localStorage.getItem('nexus_lang') as 'TR' | 'EN') || 'TR';
    this.cdr.detectChanges();
  };

  searchQuery: string = '';
  selectedCategory: string = 'All';
  selectedSkill: string = '';

  categories = [
    { key: 'All', tr: 'Tümü', en: 'All' },
    { key: 'AI', tr: 'Yapay Zeka', en: 'AI' },
    { key: 'Web', tr: 'Web', en: 'Web' },
    { key: 'Mobile', tr: 'Mobil', en: 'Mobile' },
    { key: 'Open Source', tr: 'Açık Kaynak', en: 'Open Source' },
    { key: 'Game Dev', tr: 'Oyun Geliştirme', en: 'Game Dev' }
  ];

  popularSkills: string[] = ['Angular', 'Node.js', 'Python', 'MSSQL', 'Figma', 'TypeScript', 'Unity'];
  projects: ProjectItem[] = [];

  ngOnInit(): void {
    window.addEventListener('languageChange', this.langListener);
    this.fetchProjectsFromDB();
  }

  ngOnDestroy(): void {
    window.removeEventListener('languageChange', this.langListener);
  }

  fetchProjectsFromDB(): void {
    this.http.get<ProjectItem[]>('http://localhost:3000/api/projects').subscribe({
      next: (data) => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Veritabanından projeler çekilirken hata oluştu:', err);
      }
    });
  }

  get filteredProjects(): ProjectItem[] {
    return this.projects.filter(project => {
      const matchesCategory = this.selectedCategory === 'All' || project.category === this.selectedCategory;
      const matchesSkill = !this.selectedSkill || project.skills.includes(this.selectedSkill);
      const matchesSearch = !this.searchQuery.trim() || 
        project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.skills.some(s => s.toLowerCase().includes(this.searchQuery.toLowerCase()));

      return matchesCategory && matchesSkill && matchesSearch;
    });
  }

  getCategoryLabel(catKey: string): string {
    const found = this.categories.find(c => c.key === catKey);
    if (!found) return catKey;
    return this.lang === 'TR' ? found.tr : found.en;
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
  }

  selectCategory(categoryKey: string): void {
    this.selectedCategory = categoryKey;
  }

  toggleSkill(skill: string): void {
    this.selectedSkill = this.selectedSkill === skill ? '' : skill;
  }

  onJoinProject(project: ProjectItem): void {
    const token = localStorage.getItem('nexus_token');
    if (!token) {
      alert(this.lang === 'TR' 
        ? 'Projeye başvurmak için önce giriş yapmalısınız!' 
        : 'Please sign in first to join a project!');
      this.router.navigate(['/auth']);
      return;
    }
    alert(this.lang === 'TR'
      ? `"${project.title}" projesine katılma isteğiniz başarıyla iletildi! 🚀`
      : `Your request to join "${project.title}" has been sent! 🚀`);
  }
}