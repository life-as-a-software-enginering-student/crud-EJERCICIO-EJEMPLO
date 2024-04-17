import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

//catchError: maneja errores en la petición HTTP del flujo de datos observable
//Observable: representa una colección de valores que llegan con el tiempo, o que pueden emitirse a lo largo del tiempo
//retry: reintentar la petición HTTP si falla
//throwError: crea un observable que emite un error
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {

  //URL de la API donde se gestiona los datos de los estudiantes
  base_URL = 'http://localhost:3000/student';

  //Inyecta el servicio HttpClient en el constructor para hacer peticiones HTTP
  constructor(private http: HttpClient) { }

  //Opciones de cabecera para las peticiones HTTP comunes a la API
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  handleError(error: HttpErrorResponse) {
    //Si hay un error en la petición HTTP, muestra un mensaje en la consola
    if (error.error instanceof ErrorEvent) {
      //Manejo de errores al lado del cliente o problemas de red
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        //Manejo de errores al lado del servidor o devueltos por el backend
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    //Devuelve un observable con un mensaje de error
    return throwError(
      'Something bad happened; please try again later.');
  }


  createItem(item: any): Observable<Student> {
    //Crea un nuevo estudiante en la base de datos
    return this.http.post<Student>(this.base_URL, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  //Metodo para obtener la lista de estudiantes
  getList(): Observable<Student> {
    //Obtiene la lista de estudiantes de la base de datos
    return this.http.get<Student>(this.base_URL)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

 //Obtiene un estudiante por su ID
  getItem(id: string): Observable<Student> {
    //const url = `${this.base_URL}/${id}`;
    //return this.http.get<Student>(url)
    return this.http.get<Student>(this.base_URL + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

      //Actualiza un estudiante en la base de datos por su ID
  updateItem(id: string, item: any): Observable<Student> {
    return this.http.put<Student>(this.base_URL + '/' + id, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  deleteItem(id: string) {
    const url = `${this.base_URL}/${id}`;
    return this.http.delete<Student>(url)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

}
