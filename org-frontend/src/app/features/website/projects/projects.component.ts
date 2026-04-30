import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Project } from '../../../core/models/portfolio.models';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);

  pageHeader = {
    title: 'My Projects',
    subtitle:
      'a showcase of my recent work, featuring web applications and websites built with modern technologies and best practices.'
  };

  projects: Project[] = [
    {
      image: 'imgs/e-com-project.png',
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform featuring real-time inventory.',
      tools: ['HTML', 'CSS', 'JavaScript', 'Dummyjson'],
      liveDemo: 'https://asmma-e-commerce-ee-xi.vercel.app/',
      githubCode: 'https://github.com/asmaa-abobakr1/e-commerce'
    },
    {
      image: 'imgs/calc-project.png',
      title: 'Neon Calculator',
      description: 'A modern web calculator with a glowing neon UI.',
      tools: ['HTML', 'CSS', 'JavaScript', 'BootStrap'],
      liveDemo: 'https://asmaa-calculator.vercel.app/',
      githubCode: 'https://github.com/asmaa-abobakr1/Asmaa-Calculator'
    },
    {
      image: 'imgs/recipe-project.png',
      title: 'Recipes Website',
      description: 'A recipe website with clean browsing and responsive layout.',
      tools: ['HTML', 'CSS', 'JavaScript', 'BootStrap'],
      liveDemo: 'https://asmaaaaaaaaaa-recipe.vercel.app/',
      githubCode: 'https://github.com/asmaa-abobakr1/Asmaa-Calculator'
    },
    {
      image: 'imgs/velvtune-project.png',
      title: 'Juce Audio Player',
      description: 'Full-featured Audio player using C++ and the Juce framework.',
      tools: ['C++', 'Juce', 'OOP'],
      githubCode: 'https://github.com/asmaa-abobakr1/Our_SoundBox'
    },
    {
      image: 'imgs/ludoria-project.png',
      title: 'Board Game',
      description: 'A modular Board-game application Built on a unified object-oriented framework.',
      tools: ['C++', 'Doxygen', 'OOP'],
      githubCode: 'https://github.com/asmaa-abobakr1/Ludoria-Play'
    },
    {
      image: 'imgs/imgprocessing-project.png',
      title: 'Image Processing Application',
      description: 'A Console-based Application Capable of applying multiple image filters.',
      tools: ['C++', 'File Handling', 'OOP'],
      githubCode: 'https://github.com/asmaa-abobakr1/Image-Processing-Asignment'
    }
  ];

  ngOnInit(): void {
    this.api.getProjects().pipe(catchError(() => of(null))).subscribe((data) => {
      if (!data) {
        return;
      }

      this.pageHeader = data.pageHeader ?? this.pageHeader;

      if (data.projectsList?.length) {
        this.projects = data.projectsList.map((project) => ({
          ...project,
          image: this.resolveImage(project.image)
        }));
      }
    });
  }

  private resolveImage(path?: string): string {
    if (!path) {
      return 'imgs/e-com-project.png';
    }

    if (path.startsWith('http') || path.startsWith('imgs/')) {
      return path;
    }

    const filename = path.split(/[\\/]/).pop();
    return filename ? `http://localhost:3000/files/${filename}` : path;
  }
}
