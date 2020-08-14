import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  positionType: string;
  startDate: Date;
  userId: string;
  userEmail: string;
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  id: number;
  subscription: Subscription;
  emp: Employee;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    // console.log(this.id);
    this.http.get('assets/employees.json')
      .pipe(map(employee => {
        this.emp = _.filter(employee, {id: this.id});
        console.log(this.emp);
      })).subscribe();

  }
  onSubmit(edited: NgForm){

  }
  onDelete(){

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
