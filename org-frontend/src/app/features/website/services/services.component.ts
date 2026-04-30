import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ServiceItem } from '../../../core/models/portfolio.models';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);

  hero = {
    title: 'Services I Offer',
    subtitle:
      'Professional web development services tailored to bring your ideas to life with quality, creativity, and attention to detail.'
  };

  footerAction = {
    title: 'Ready to Start Your Project?',
    description:
      "Let's collaborate to create something amazing. Get in touch to discuss your project and how I can help bring your vision to life."
  };

  services: ServiceItem[] = [
    { icon: 'fa fa-code', title: 'Front-End Development', description: 'Building responsive, high-performance user interfaces using modern frameworks like Angular and React, with a focus on clean UI/UX and best practices.' },
    { icon: 'fa fa-server', title: 'Back-End Development', description: 'Developing scalable and efficient server-side applications using Node.js, building RESTful APIs, handling databases, and ensuring performance and security.' },
    { icon: 'fa-solid fa-palette', title: 'UI/UX Design', description: 'Creating intuitive and beautiful user interfaces with focus on user experience and accessibility.' },
    { icon: 'fa-regular fa-lightbulb', title: 'Frontend Consulting', description: 'Providing expert advice on frontend architecture, performance optimization, and best practices.' },
    { icon: 'fa-solid fa-magnifying-glass', title: 'Code Review', description: 'Thorough code reviews to improve code quality, maintainability, and performance.' }
  ];

  ngOnInit(): void {
    this.api.getServices().pipe(catchError(() => of(null))).subscribe((data) => {
      if (!data) {
        return;
      }

      this.hero = data.hero ?? this.hero;
      this.footerAction = data.footerAction ?? this.footerAction;

      if (data.services?.length) {
        this.services = data.services;
      }
    });
  }
}
