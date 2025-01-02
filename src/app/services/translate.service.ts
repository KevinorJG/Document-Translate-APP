import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private api_base_url = environment.api_base_url;
  constructor(private httpClient: HttpClient) {}

  translateDocument(
    file: File,
    targetLanguage: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('targetLanguage', targetLanguage);

    return this.httpClient
      .post<any>(`${this.api_base_url}/translate-document`, formData, {
        reportProgress: true,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.showError(error.error || 'An unexpected error occurred.');
          return throwError(() => new Error(error.message));
        })
      );
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
    });
  }

  languagesSupported() {
    return this.httpClient.get(`${this.api_base_url}/languages-supported`);
  }
}
