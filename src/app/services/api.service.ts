import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://momentum.redberryinternship.ge/api'; // Base URL for API requests.

  constructor(private http: HttpClient) {} // Inject HttpClient for making HTTP requests.

  /**
   * Performs a GET request to the specified endpoint.
   * @param endpoint - API endpoint (relative path).
   * @returns An Observable of the requested data.
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError)); // Handle errors globally.
  }

  /**
   * Performs a POST request to the specified endpoint with a request body.
   * @param endpoint - API endpoint (relative path).
   * @param body - Data to be sent in the request body.
   * @returns An Observable of the response.
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError)); // Handle errors globally.
  }

  /**
   * Performs a PUT request to the specified endpoint with a request body.
   * @param endpoint - API endpoint (relative path).
   * @param body - Data to be updated.
   * @returns An Observable of the updated data.
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError)); // Handle errors globally.
  }

  /**
   * Handles API errors by logging them and returning an error Observable.
   * @param error - The error response object.
   * @returns An Observable that throws an error.
   */
  private handleError(error: any): Observable<never> {
    console.error('API error:', error); // Log the error for debugging.
    return throwError(() => new Error(error)); // Throw an error to be handled by the subscriber.
  }
}
