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
import { MatInputModule } from '@angular/material/input';
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
            FormsModule, ReactiveFormsModule,
            MatInputModule

  ],

  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})


export class StudentComponent implements OnInit {

  //referencia al formulario en la plantilla para manejar los datos del formulario
  @ViewChild('studentForm', {static: false})
  studentForm!: NgForm;

  //Datos del estudiante para el formulario y manejo de datos
  StudentData!: Student;


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

  //metodo de inicialización que configura la paginación y el ordenamiento de la tabla
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //traer todos los estudiantes (metodo faltante)
  }

}
