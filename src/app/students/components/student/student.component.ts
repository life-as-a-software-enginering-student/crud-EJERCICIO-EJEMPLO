import { Student } from './../../models/student.model';
import { Component, ViewChild, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

//aqui se referencia a la tabla de datos de angular material
//el matTableDataSource es para mostrar los datos en la tabla
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

//el matSort es para ordenar los datos de la tabla
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { HttpDataService } from '../../services/http-data.service';
import { HttpClientModule } from '@angular/common/http';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-student',
  standalone: true,
  //estos son los modulos de angular material que se usan en este componente
  imports: [MatToolbarModule,
            MatIconModule,
            MatButtonModule,
            MatTableModule,
            MatPaginator,
            MatSort,
            MatFormField,
            FormsModule, ReactiveFormsModule, CommonModule,
            MatInputModule,
            HttpClientModule //Modulo para hacer peticiones HTTP

  ],

  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})


export class StudentComponent implements OnInit {

  //referencia al formulario en la plantilla para manejar los datos del formulario
  @ViewChild('studentForm', {static: false})
  studentForm!: NgForm;

  //Datos del estudiante para el formulario y manejo de datos
  studentData!: Student;


  //Fuente de datos de la tabla y las columnas que se mostrarán en la tabla
  dataSource = new MatTableDataSource();
  //with actions tu puedes agregar, editar y eliminar registros
  displayedColumns: string[] = ['id', 'name', 'age', 'mobile', 'email', 'address', 'actions'];

  //el viewchild es un decorador que se usa para acceder a un elemento del DOM
  //referencia al paginador 
  @ViewChild(MatPaginator, {static: true} ) 
  paginator!: MatPaginator;

  //referencia al ordenador de la tabla 
  @ViewChild(MatSort) 
  sort!: MatSort;

  isEditMode = false; //indicador para saber si el formulario está en modo de edición o no

  //Inyecta el servicio HttpDataService en el constructor para hacer peticiones HTTP
  constructor(private httpDataService: HttpDataService) {
    //Inicializa los datos del estudiante
    this.studentData = {} as Student;
  }

  //metodo de inicialización que configura la paginación y el ordenamiento de la tabla
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //traer todos los estudiantes (metodo faltante)
    this.getAllStudents();
  }
  
  //obtiene todos los estudiantes utilizando el servicio http 
  getAllStudents() {
    //Obtiene la lista de estudiantes de la base de datos
    this.httpDataService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  //Inicia la edición de un elemento seleccionado y establece el formulario en modo de edición
  editItem(element: any) {
    //Copia el objeto del elemento seleccionado
    this.studentData = cloneDeep(element);
    this.isEditMode = true;
  }

  //cancela la edición de un elemento seleccionado y restablece el formulario
  cancelEdit() {
    this.isEditMode = false;
    this.studentForm.resetForm();
  }

  deleteItem(id: string) {//puede ser any
    //Elimina un estudiante de la base de datos
    this.httpDataService.deleteItem(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((o: any) => o.id !== id);
    });
    
  }

  //Agrega un nuevo estudiante a la base de datos utilizando el servicio http
  addStudent() {
    let maxID: number = 0;
    maxID = this.dataSource.data.reduce((max: number, student: any) => student.id >max? student.id:max, 0);
    this.studentData.id = (Number(maxID)+1).toString(); //concatena, convierte a string 


    //Crea un nuevo estudiante en la base de datos
    this.httpDataService.createItem(this.studentData).subscribe((response: any) => {
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map(o => o);
    });
  }

  //Actualiza un estudiante en la base de datos utilizando el servicio http
  updateStudent() {
    //Actualiza un estudiante en la base de datos
    this.httpDataService.updateItem(this.studentData.id, this.studentData).subscribe((response: any) => {
      this.dataSource.data = this.dataSource.data.map((o: any) => {
        if (o.id === response.id) {
          o = this.studentData;
        }
        return o;
      });
    });
  }

  //Maneja la presentación del formulario y la validación de los datos del formulario
  onSubmit() {
    if (this.studentForm.form.valid) {
      if (this.isEditMode)
        this.updateStudent();
      else
        this.addStudent();

      this.cancelEdit();
    } else {
      console.log('Invalid Data');
    }
  }
}
