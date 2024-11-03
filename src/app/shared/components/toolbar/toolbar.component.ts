import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../security/auth.service';
import { ShareMenuStatusService } from '../../services/share-menu-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [AuthService],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  pageTitle: string | undefined;
  userName: String | null = '';
  userRole: String | null = '';
  menuTrueFalse: boolean | undefined;

  constructor(
    private titleService: Title,
    private router: Router,
    private authService: AuthService,
    private shareMenuStatusService: ShareMenuStatusService
  ) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getTitle();
    this.userRole = this.authService.getDecodedToken()?.scope || null;
    this.getToken();

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
  }

  cleanLoggedUser() {
    sessionStorage.setItem('jwtToken', '');
    this.router.navigate(['/']);
  }

  getToken() {
    const token = sessionStorage.getItem('jwtToken');
    this.userName = this.authService.getUserNameFromToken();
  }
}
