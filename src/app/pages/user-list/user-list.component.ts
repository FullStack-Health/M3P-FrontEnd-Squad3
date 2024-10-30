import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { SidebarMenuComponent } from "../../shared/components/sidebar-menu/sidebar-menu.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Page } from '../../models/page.interface';
import { ApiService } from '../../shared/services/api.service';
import { ListUsers } from '../../models/list-users.model';
import { Title } from '@angular/platform-browser';
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';
import { RoleTransformPipe } from "../../shared/pipes/role-transform.pipe";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, HttpClientModule, CommonModule, FormsModule, RouterModule, RoleTransformPipe],
  providers: [ApiService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  searchTerm: string = '';
  usersList: any = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  hasMorePages: boolean = false;
  noResults: boolean = false;
  menuTrueFalse: boolean | undefined;
  isScreenLarge: boolean | undefined;

  constructor(
    private titleService: Title,
    private apiService: ApiService,
    private router: Router,
    private shareMenuStatusService: ShareMenuStatusService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Lista de usuários');
    this.getUsers(this.currentPage);

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });

    this.checkWindowSize();
  }

  getUsers(page: number): void {
    const searchTerm = this.searchTerm.trim();

    let email: string | undefined;
    let id: string | undefined;

    if (searchTerm) {
      if (/\d/.test(searchTerm)) {
        id = searchTerm;
      } else {
        email = searchTerm;
      }
    }

    this.apiService.listUsers(page, this.pageSize, email, id).subscribe({
      next: (response: Page<ListUsers>) => {

        this.usersList = response.content;

        if (this.usersList.length === 0) {
          this.noResults = true;
          this.usersList = [];
        } else {
          this.noResults = false;
        }

        this.totalPages = response.totalPages;
        this.hasMorePages = this.currentPage < this.totalPages - 1;
        console.log('Users loaded successfully:', this.usersList);

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
        this.noResults = true;
        this.usersList = [];
      }
    });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getUsers(this.currentPage);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getUsers(this.currentPage);
    }
  }

  isPreviousDisabled(): boolean {
    return this.currentPage === 0;
  }

  isNextDisabled(): boolean {
    return this.currentPage >= this.totalPages - 1;
  }

  search(): void {
    this.currentPage = 0;
    this.getUsers(this.currentPage);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.getUsers(this.currentPage);
  }

  editUser(id: string) {
    this.router.navigate(['/editar-usuario', id])
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  private checkWindowSize(): void {
    if (window.innerWidth > 575) {
      this.isScreenLarge = true;
    } else {
      this.isScreenLarge = false;
    }
  }

}
