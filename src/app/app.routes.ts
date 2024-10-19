import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SidebarMenuComponent } from './shared/components/sidebar-menu/sidebar-menu.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'testesidebarmenu', component: SidebarMenuComponent },
];
