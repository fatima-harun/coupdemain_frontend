import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
import { AuthService } from './../../../Services/auth.service';
import { CandidatureService } from './../../../Services/candidature.service';
import { Router } from '@angular/router';
import { HeaderadminComponent } from './../../../headeradmin/headeradmin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../footer/footer.component';

Chart.register(...registerables);

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HeaderadminComponent, FormsModule,FooterComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myChart') myChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;

  tabUser: any[] = [];
  filteredUsers: any[] = [];
  employeurs: any[] = [];
  employers: any[] = [];
  totalUsers: number = 0;
  totalEmployeurs: number = 0;
  totalEmployers: number = 0;
  nombreRecrute: number = 0;
  nombreNonRecrute: number = 0;

  searchKeyword: string = '';
  currentPage: number = 1;
  usersPerPage: number = 6;

  barChart: any;
  pieChart: any;

  constructor(
    private authService: AuthService,
    private candidatureService: CandidatureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUser();
    this.loadEmployers();
    this.loadJobSeekers();
    this.loadRecruitmentStats();
  }

  ngAfterViewInit(): void {
    this.updateBarChart();
    this.updatePieChart();
  }

  ngOnDestroy(): void {
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
  }

  fetchUser() {
    this.authService.getAllUser().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.tabUser = response;
          this.filteredUsers = [...this.tabUser];
          this.totalUsers = this.tabUser.length;
          this.updateBarChart();
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    );
  }

  getimage(photo: string): string {
    return `http://127.0.0.1:8000/storage/${photo}`;
  }

  toggleuserStatus(user: any) {
    this.authService.toggleStatus(user.id).subscribe({
      next: (response: any) => {
        user.status = response.status;
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Statut mis à jour avec succès',
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la mise à jour du statut',
        });
      },
    });
  }

  loadEmployers(): void {
    this.authService.getEmployeurs().subscribe((data) => {
      this.employeurs = data;
      this.totalEmployeurs = this.employeurs.length;
      this.updateBarChart();
    });
  }

  loadJobSeekers(): void {
    this.authService.getEmployer().subscribe((data) => {
      this.employers = data;
      this.totalEmployers = this.employers.length;
      this.updateBarChart();
    });
  }

  loadRecruitmentStats(): void {
    this.candidatureService.getRecruter().subscribe({
      next: (stats) => {
        this.nombreRecrute = stats.nombre_recrute;
        this.nombreNonRecrute = stats.nombre_non_recrute;
        this.updatePieChart();
      },
      error: (err) => console.error(err),
    });
  }

  updateBarChart(): void {
    if (this.barChart) this.barChart.destroy();
    const canvas = this.myChartRef.nativeElement;
    if (!canvas) return;

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Utilisateurs', 'Employeurs', 'Demandeurs d\'emploi'],
        datasets: [
          {
            label: 'Nombre',
            data: [this.totalUsers, this.totalEmployeurs, this.totalEmployers],
            backgroundColor: ['#4A69BD', '#FED330', '#bdc3c7'],
          },
        ],
      },
    });
  }

  updatePieChart(): void {
    if (this.pieChart) this.pieChart.destroy();
    const canvas = this.pieChartRef.nativeElement;
    if (!canvas) return;

    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Recruté', 'Non Recruté'],
        datasets: [
          {
            label: 'Recrutement',
            data: [this.nombreRecrute, this.nombreNonRecrute],
            backgroundColor: ['#FED330', '#4A69BD'],
          },
        ],
      },
    });
  }

  filterUsers() {
    if (!this.searchKeyword.trim()) {
      this.filteredUsers = [...this.tabUser];
    } else {
      this.filteredUsers = this.tabUser.filter((user) => {
        const fullName = `${user.nom} ${user.prenom} ${user.email}`;
        return fullName.toLowerCase().includes(this.searchKeyword.toLowerCase());
      });
    }
    this.currentPage = 1;
  }

  changeRoleBackground(role: string): string {
    return role === 'Admin' ? 'badge bg-danger' : 'badge bg-success';
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.usersPerPage;
    return this.filteredUsers.slice(start, start + this.usersPerPage);
  }
}
