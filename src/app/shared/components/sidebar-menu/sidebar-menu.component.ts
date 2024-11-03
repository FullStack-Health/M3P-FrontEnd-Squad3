import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShareMenuStatusService } from '../../services/share-menu-status.service';
import { AuthService } from '../../../security/auth.service';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [AuthService],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  menuTrueFalse: boolean = true;
  userRole: string | null = '';

  constructor(private router: Router, private shareMenuStatusService: ShareMenuStatusService, private authService: AuthService) { }

  ngOnInit(): void {
    this.checkWindowSize();
    this.userRole = this.authService.getDecodedToken()?.scope || null;
  }

  cleanLoggedUser() {
    sessionStorage.setItem('jwtToken', '');
    this.router.navigate(['']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  private checkWindowSize(): void {
    if(window.innerWidth < 768) {
      this.menuTrueFalse = false;
      this.shareMenuStatusService.setMenuTrueFalse(this.menuTrueFalse);
    } else {
      this.menuTrueFalse = true;
      this.shareMenuStatusService.setMenuTrueFalse(this.menuTrueFalse);
    }
  }

  openCloseMenu() {
    this.menuTrueFalse = !this.menuTrueFalse
    this.shareMenuStatusService.setMenuTrueFalse(this.menuTrueFalse);
  }
}
