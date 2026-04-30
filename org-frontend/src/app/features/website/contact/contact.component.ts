import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private readonly api = inject(PortfolioApiService);

  form = {
    name: '',
    email: '',
    message: ''
  };

  sent = false;
  sending = false;
  errorMessage = '';

  submit(): void {
    this.sent = false;
    this.errorMessage = '';
    this.sending = true;

    this.api.sendMessage(this.form)
      .pipe(finalize(() => (this.sending = false)))
      .subscribe({
        next: () => {
          this.sent = true;
          this.form = { name: '', email: '', message: '' };
        },
        error: () => {
          this.errorMessage = 'Message could not be sent. Please make sure the backend is running.';
        }
      });
  }
}
