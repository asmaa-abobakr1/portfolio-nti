import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, finalize, forkJoin, of } from 'rxjs';
import {
  AboutData,
  ContactMessage,
  Experience,
  HomeData,
  HomeService,
  Project,
  ServiceItem,
  ServicesResponse
} from '../../../core/models/portfolio.models';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);

  activeTab = 'home';
  saving = false;
  statusMessage = '';
  errorMessage = '';
  selectedProfileImage?: File;

  homeForm: HomeData = {
    name: 'Asmaa',
    jobTitle: 'Front-end Developer',
    mainDescription: '',
    socialLinks: { github: '', linkedin: '' },
    services: []
  };
  newHomeService: HomeService = { title: '', description: '' };

  aboutForm: AboutData = {
    bio: '',
    stats: { yearsExperience: '1+', projectsCompleted: '20+' },
    experiences: [],
    skills: [],
    values: []
  };
  newExperience: Experience = { role: '', company: '', duration: '', location: '' };

  projectHeader = { title: 'My Projects', subtitle: 'a showcase...' };
  projects: Project[] = [];
  selectedProjectImage?: File;
  newProject: Project & { toolsText?: string } = {
    title: '',
    description: '',
    image: '',
    tools: [],
    toolsText: '',
    liveDemo: '',
    githubCode: ''
  };

  serviceContent: ServicesResponse = {
    hero: { title: 'Services I Offer', subtitle: '' },
    services: [],
    footerAction: { title: 'Ready to Start Your Project?', description: '' }
  };
  newService: ServiceItem = { icon: '', title: '', description: '' };

  messages: ContactMessage[] = [];
  archivedMessages: ContactMessage[] = [];
  inboxError = '';

  tabs = [
    ['home', 'fa fa-home', 'Home Page'],
    ['about', 'fa fa-user-tie', 'About Page'],
    ['projects', 'fa fa-code', 'Projects'],
    ['services', 'fa fa-cogs', 'Services'],
    ['contact', 'fa fa-envelope', 'Messages']
  ];

  showTab(tab: string): void {
    this.activeTab = tab;
  }

  get activeHomeServices(): HomeService[] {
    return (this.homeForm.services ?? []).filter((service) => !service.isDeleted);
  }

  get activeExperiences(): Experience[] {
    return (this.aboutForm.experiences ?? []).filter((experience) => !experience.isDeleted);
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadMessages();
  }

  loadDashboardData(): void {
    forkJoin({
      home: this.api.getHome().pipe(catchError(() => of(null))),
      about: this.api.getAbout().pipe(catchError(() => of(null))),
      projects: this.api.getProjects().pipe(catchError(() => of(null))),
      services: this.api.getServices().pipe(catchError(() => of(null)))
    }).subscribe(({ home, about, projects, services }) => {
      if (home) {
        this.homeForm = {
          ...this.homeForm,
          ...home,
          socialLinks: { ...this.homeForm.socialLinks, ...home.socialLinks },
          services: home.services ?? []
        };
      }

      if (about) {
        this.aboutForm = {
          ...this.aboutForm,
          ...about,
          stats: { ...this.aboutForm.stats, ...about.stats },
          experiences: about.experiences ?? [],
          skills: about.skills ?? [],
          values: about.values ?? []
        };
      }

      if (projects) {
        this.projectHeader = projects.pageHeader ?? this.projectHeader;
        this.projects = projects.projectsList ?? [];
      }

      if (services) {
        this.serviceContent = {
          hero: services.hero ?? this.serviceContent.hero,
          services: services.services ?? [],
          footerAction: services.footerAction ?? this.serviceContent.footerAction
        };
      }
    });
  }

  saveHome(): void {
    const formData = new FormData();
    formData.append('jobTitle', this.homeForm.jobTitle);
    formData.append('name', this.homeForm.name);
    formData.append('mainDescription', this.homeForm.mainDescription ?? '');
    formData.append('github', this.homeForm.socialLinks?.github ?? '');
    formData.append('linkedin', this.homeForm.socialLinks?.linkedin ?? '');
    formData.append('services', JSON.stringify(this.homeForm.services ?? []));
    if (this.selectedProfileImage) {
      formData.append('profileImage', this.selectedProfileImage);
    }

    this.runSave(this.api.saveHome(formData), 'Home saved.');
  }

  selectProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedProfileImage = input.files?.[0];
  }

  addHomeService(): void {
    if (!this.newHomeService.title.trim()) {
      return;
    }

    this.homeForm.services = [...(this.homeForm.services ?? []), { ...this.newHomeService }];
    this.newHomeService = { title: '', description: '' };
    this.saveHome();
  }

  removeHomeService(service: HomeService): void {
    service.isDeleted = true;
    this.saveHome();
  }

  saveAbout(): void {
    this.runSave(this.api.saveAbout(this.aboutForm), 'About saved.');
  }

  addExperience(): void {
    if (!this.newExperience.role.trim()) {
      return;
    }

    this.aboutForm.experiences = [...(this.aboutForm.experiences ?? []), { ...this.newExperience }];
    this.newExperience = { role: '', company: '', duration: '', location: '' };
    this.saveAbout();
  }

  removeExperience(experience: Experience): void {
    experience.isDeleted = true;
    this.saveAbout();
  }

  saveProjectHeader(): void {
    this.runSave(this.api.updateProjectsHeader(this.projectHeader), 'Project header saved.');
  }

  addProject(): void {
    const project = new FormData();
    project.append('title', this.newProject.title);
    project.append('description', this.newProject.description);
    project.append('tools', this.newProject.toolsText ?? '');
    project.append('liveDemo', this.newProject.liveDemo ?? '');
    project.append('githubCode', this.newProject.githubCode ?? '');

    if (this.selectedProjectImage) {
      project.append('image', this.selectedProjectImage);
    }

    this.runSave(this.api.addProject(project), 'Project added.', () => {
      this.newProject = { title: '', description: '', image: '', tools: [], toolsText: '', liveDemo: '', githubCode: '' };
      this.selectedProjectImage = undefined;
      this.loadDashboardData();
    });
  }

  selectProjectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedProjectImage = input.files?.[0];
  }

  deleteProject(project: Project): void {
    if (!project._id) {
      return;
    }

    this.runSave(this.api.deleteProject(project._id), 'Project deleted.', () => this.loadDashboardData());
  }

  saveServicesContent(): void {
    this.runSave(
      this.api.updateServicesContent({
        hero: this.serviceContent.hero,
        footerAction: this.serviceContent.footerAction
      }),
      'Services content saved.'
    );
  }

  addService(): void {
    if (!this.newService.title.trim()) {
      return;
    }

    this.runSave(this.api.addService(this.newService), 'Service added.', () => {
      this.newService = { icon: '', title: '', description: '' };
      this.loadDashboardData();
    });
  }

  deleteService(service: ServiceItem): void {
    if (!service._id) {
      return;
    }

    this.runSave(this.api.deleteService(service._id), 'Service deleted.', () => this.loadDashboardData());
  }

  loadMessages(): void {
    forkJoin({
      active: this.api.getMessages().pipe(catchError(() => of([]))),
      archived: this.api.getArchivedMessages().pipe(catchError(() => of([])))
    }).subscribe(({ active, archived }) => {
      this.messages = active;
      this.archivedMessages = archived;
    });
  }

  moveMessageToTrash(message: ContactMessage): void {
    if (!message._id) {
      return;
    }

    this.inboxError = '';
    this.api.deleteMessage(message._id).subscribe({
      next: () => this.loadMessages(),
      error: () => {
        this.inboxError = 'Could not move message to trash. Check that the backend is running.';
      }
    });
  }

  private runSave(request: Observable<unknown>, success: string, afterSave?: () => void): void {
    this.saving = true;
    this.statusMessage = '';
    this.errorMessage = '';

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.statusMessage = success;
        afterSave?.();
      },
      error: () => {
        this.errorMessage = 'Save failed. Make sure the backend and MongoDB are running.';
      }
    });
  }
}
