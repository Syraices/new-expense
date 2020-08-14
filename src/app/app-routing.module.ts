import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesComponent } from './expenses/expenses.component';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [
  { path: '', component: ExpensesComponent, pathMatch: 'full'},
  { path: ':id', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
