import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HomeData, HomeService } from '../../../core/models/portfolio.models';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);

  home: HomeData = {
    jobTitle: 'FRONTEND DEVELOPER',
    name: 'Asmaa',
    mainDescription:
      'I craft beautiful, functional, and user-friendly web experiences with modern technologies and creative design.',
    profileImage: 'imgs/Personal-Photo.jpeg',
    socialLinks: {
      github: 'https://github.com/asmaa-abobakr1',
      linkedin: 'https://linkedin.com/in/asmaa-abobakr1'
    }
  };

  work: HomeService[] = [
    {
      title: 'Front-End Development',
      description: 'Building responsive, performant web applications with React, TypeScript, and modern CSS frameworks.'
    },
    {
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces with focus on user experience and accessibility.'
    },
    {
      title: 'Performance Optimization',
      description: 'Ensuring fast load times, smooth animations, and optimal performance across all devices.'
    }
  ];

  ngOnInit(): void {
    this.api.getHome().pipe(catchError(() => of(null))).subscribe((data) => {
      if (!data) {
        return;
      }

      this.home = {
        ...this.home,
        ...data,
        profileImage: this.resolveImage(data.profileImage) ?? this.home.profileImage
      };

      const activeServices = data.services?.filter((service) => !service.isDeleted);
      if (activeServices?.length) {
        this.work = activeServices;
      }
    });
  }

  private resolveImage(path?: string): string | undefined {
    if (!path) {
      return undefined;
    }

    if (path.startsWith('http') || path.startsWith('imgs/')) {
      return path;
    }

    const filename = path.split(/[\\/]/).pop();
    return filename ? `http://localhost:3000/files/${filename}` : undefined;
  }
}
