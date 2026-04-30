import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/website/home/home.component').then((m) => m.HomeComponent),
    title: 'Asmaa - Home'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/website/about/about.component').then((m) => m.AboutComponent),
    title: 'About'
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/website/projects/projects.component').then((m) => m.ProjectsComponent),
    title: 'Projects'
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/website/services/services.component').then((m) => m.ServicesComponent),
    title: 'Services'
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/website/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: "Asmaa's Dashboard"
  },
  { path: '404', component: NotFoundComponent, title: 'Not Found' },
  { path: '**', redirectTo: '404' }
];
