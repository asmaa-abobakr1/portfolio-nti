import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AboutData, Experience, SkillGroup, ValueItem } from '../../../core/models/portfolio.models';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);

  about: AboutData = {
    bio: `Student at the Faculty of Computers and Artificial Intelligence, Cairo University.
      I have a strong foundation in software engineering principles and modern web development.
      I build responsive and scalable web applications using HTML, CSS, and JavaScript,
      with a focus on clean design, performance, and user experience.
      On the frontend, I work with React and Angular to develop dynamic,
      component-based interfaces. On the backend, I have solid experience with Node.js,
      where I build RESTful APIs, handle server-side logic, authentication, and database integration.
      I am passionate about writing clean, maintainable code and continuously improving my problem-solving skills.`,
    stats: {
      yearsExperience: '1+',
      projectsCompleted: '20+'
    }
  };

  experiences: Experience[] = [
    { role: 'Frontend Development Trainee', company: 'CodeAlpha', duration: 'Mar 2026 - Apr 2026', location: 'Remote' },
    { role: 'Mean Stack Development Trainee', company: 'National Telecommunication Institute-NTI', duration: 'Mar 2026 - Jun 2026', location: 'On-site' },
    { role: 'Frontend Development Trainee', company: 'CodeVeda Technologies', duration: 'Mar 2026 - Apr 2026', location: 'Remote' },
    { role: 'Green Hydrogen System Trainee', company: 'The British Universite in Egypt-BUE', duration: 'Mar 2026 - Mar 2027', location: 'Remote' },
    { role: 'Frontend Development Trainee', company: 'Digital Egypt Pioneers Initiative- DEPI', duration: 'Mar 2026 - Mar 2027', location: 'Hybrid' }
  ];

  skills: SkillGroup[] = [
    { categoryName: 'Frontend', technologies: ['React', 'Angular', 'Next.js', 'TypeScript'] },
    { categoryName: 'Backend', technologies: ['Node.js', 'Express.js', 'MongoDB', 'SQL'] },
    { categoryName: 'Styling', technologies: ['Tailwind CSS', 'CSS', 'Bootstrap', 'Styled Components'] },
    { categoryName: 'Tools', technologies: ['Git', 'Figma', 'Postman', 'Vercel'] }
  ];

  values: ValueItem[] = [
    { icon: 'fa fa-code', title: 'Clean Code', description: 'Writing maintainable, scalable, and well-documented code.' },
    { icon: 'fa-solid fa-palette', title: 'Creative Design', description: 'Crafting beautiful interfaces that delight users.' },
    { icon: 'fa-solid fa-bolt', title: 'Performance', description: 'Building fast, optimized applications that perform smoothly.' },
    { icon: 'fa-solid fa-heart', title: 'User-Centric', description: 'Putting users first in every design and development decision.' }
  ];

  ngOnInit(): void {
    this.api.getAbout().pipe(catchError(() => of(null))).subscribe((data) => {
      if (!data) {
        return;
      }

      this.about = { ...this.about, ...data };

      const activeExperiences = data.experiences?.filter((item) => !item.isDeleted);
      const activeSkills = data.skills?.filter((item) => !item.isDeleted);

      if (activeExperiences?.length) {
        this.experiences = activeExperiences;
      }

      if (activeSkills?.length) {
        this.skills = activeSkills;
      }

      if (data.values?.length) {
        this.values = data.values;
      }
    });
  }
}
