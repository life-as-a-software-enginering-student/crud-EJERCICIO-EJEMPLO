import { Routes } from '@angular/router';
import { StudentComponent } from './students/components/student/student.component';

export const routes: Routes = [

    //Redirecciona a la ruta raiz 'students' ('') a la ruta 'students' usando el pathMatch: 'full'
    //se asegura que se redirija solo cuando la ruta sea exactamente ''.
    {path: '', redirectTo: 'students', pathMatch: 'full'},

    //Asocia a la ruta '/Students' con el componente StudentComponent
    {path: 'students', component: StudentComponent }
];
