import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { StatsService } from '../../../core/services/stats.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, DecimalPipe],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private statsService = inject(StatsService);
  
  stats = signal<any>(null);
  loading = signal(true);
  today = new Date();

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.loading.set(true);
    this.statsService.getSummary().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching stats', err);
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20';
      case 'PAID': return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case 'PROCESSING': return 'bg-purple-500/10 text-purple-600 border border-purple-500/20';
      case 'SHIPPED': return 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20';
      case 'DELIVERED': return 'bg-green-500/10 text-green-600 border border-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border border-red-500/20';
      default: return 'bg-stone-500/10 text-stone-600 border border-stone-500/20';
    }
  }
}
