import {Component, OnInit, ComponentFactoryResolver} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {MatSelectChange} from '@angular/material/select';
import * as _ from 'lodash';
import {map, shareReplay} from 'rxjs/operators';

interface EmpAccount {
  accountId: string;
  accountName: string;
  employeeId?: string[];
  employeeName?: string[];
  amount?: number[];
  accountTotal?: number;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ExpensesComponent implements OnInit {
  public filteredList: EmpAccount[] = [];
  private accountList: EmpAccount[] = [];
  public employees: string[] = [];
  public displayedColumns = ['accountName', 'accountTotal'];
  public dataSource: EmpAccount[] = [];
  public expandedAccount: EmpAccount | null;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient
      .get<object[]>('assets/data.json')
      .pipe(
        map((account) => {
          // const empList: EmpAccount[] = [];
          return account.map((acc: EmpAccount) => {
            return _.pick(acc, ['accountId', 'accountName', 'amount']);
          });
          // account.map((acc) => {
          //   const b = _.pick(acc, ['accountId', 'accountName', 'employeeId', 'employeeName', 'amount']);
          //   const a = _.findIndex(empList, {accountName: b.accountName});
          //   this.employees.push(b.employeeName);
          //   if (a < 0) {
          //     // tslint:disable-next-line:max-line-length
          //     empList.push({accountId: b.accountId, accountName: b.accountName, employeeId: [b.employeeId], employeeName: [b.employeeName], amount: [b.amount]});
          //   } else {
          //     empList[a] = this.merger(empList[a], b);
          //   }
          // });
          // this.accountList = empList;
          // this.accountList.map(acc => {
          //   acc.accountTotal = _.sum(acc.amount);
          // });
          // this.employees = _.pick(this.accountList, 'employeeName');
          // console.log(this.employees);
          // // this.employees = _.uniq(this.employees.sort());
          // this.dataSource = this.accountList;
        }),
        shareReplay()
      )
      .subscribe(account => {
          const list = _.uniqBy(account, 'accountId');
          const list2 = list.map(acc => {
            const list3 = _.filter(account, {accountName: acc.accountName});

            function cust(ov, os) {
              if (_.isArray(ov)) {
                ov.concat(os);
              }
            }
            const list4 = _.mergeWith(acc, list3, cust);
            console.log(list4);
            return acc;
          });
        }
      );
  }

  createList(account) {

  }

  applyFilter(input) {
    this.dataSource = this.accountList;
    this.filteredList = _.filter(this.dataSource, {employeeName: [input.value]});
    console.log(this.filteredList);
    this.dataSource = this.filteredList;
  }

  merger(arr1, arr2) {
    function cust(oV, sV) {
      if (_.isArray(oV)) {
        return oV.concat(sV);
      }
    }

    return _.mergeWith(arr1, arr2, cust);
  }
}

