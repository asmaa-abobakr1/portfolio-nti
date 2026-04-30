import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import {
  AboutData,
  ContactMessage,
  ContactPayload,
  HomeData,
  Project,
  ProjectsResponse,
  ServiceItem,
  ServicesResponse
} from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getHome(): Observable<HomeData | null> {
    return this.http.get<HomeData | null>(`${this.apiUrl}/home`);
  }

  saveHome(data: FormData): Observable<HomeData> {
    return this.http.post<HomeData>(`${this.apiUrl}/home`, data);
  }

  getAbout(): Observable<AboutData | null> {
    return this.http.get<AboutData | null>(`${this.apiUrl}/about`);
  }

  saveAbout(data: AboutData): Observable<{ message: string; data: AboutData }> {
    return this.http.post<{ message: string; data: AboutData }>(`${this.apiUrl}/about`, data);
  }

  getProjects(): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(`${this.apiUrl}/projects`);
  }

  updateProjectsHeader(header: { title: string; subtitle: string }): Observable<{ message: string; data: unknown }> {
    return this.http.put<{ message: string; data: unknown }>(`${this.apiUrl}/projects/update-header`, header);
  }

  addProject(project: FormData | Partial<Project>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/projects/add`, project);
  }

  deleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/projects/delete/${id}`);
  }

  getServices(): Observable<ServicesResponse> {
    return this.http.get<ServicesResponse>(`${this.apiUrl}/services`);
  }

  updateServicesContent(content: {
    hero: ServicesResponse['hero'];
    footerAction: ServicesResponse['footerAction'];
  }): Observable<{ message: string; data: unknown }> {
    return this.http.put<{ message: string; data: unknown }>(`${this.apiUrl}/services/update-content`, content);
  }

  addService(service: ServiceItem): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/services/add`, service);
  }

  deleteService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/services/delete/${id}`);
  }

  sendMessage(payload: ContactPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/contact/send`, payload);
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/contact/admin/dashboard`);
  }

  getArchivedMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/contact/admin/archive`);
  }

  deleteMessage(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/contact/admin/message/${id}`);
  }
}
