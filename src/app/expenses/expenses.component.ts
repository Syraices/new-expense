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
  private filteredList: EmpAccount[] = [];
  private accountList: EmpAccount[] = [];
  public employees: string[] = [];
  public displayedColumns = ['accountName', 'accountTotal'];
  public dataSource: EmpAccount[] = [];
  public expandedAccount: EmpAccount | null;
  public filterApplied = false;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient
      .get<object[]>('assets/data.json')
      .pipe(
        map((account) => {
          // const empList: EmpAccount[] = [];
          return account.map((acc: EmpAccount) => {
            return _.pick(acc, ['accountId', 'accountName', 'employeeId', 'employeeName', 'amount']);
          });
        }),
        shareReplay()
      )
      .subscribe(account => {
          _.forEach(account, (o) => {

            o.amount = [o.amount];
            o.employeeName = [o.employeeName];
            o.employeeId = [o.employeeId];
          });
          const list = _.uniqBy(account, 'accountId');
          this.accountList = list.map(acc => {
            const list3 = _.filter(account, {accountName: acc.accountName});
            _.forEach(list3, (o, k) => {
              _.mergeWith(list3[0], list3[k + 1], (ov, os) => {
                if (_.isArray(ov)) {
                  return ov.concat(os);
                }
              });
            });
            return acc;
          });
          this.dataSource = this.totals(this.accountList);
          this.dataSource = this.accountList;
        }
      );
  }
  totals(list) {
    this.employees = [];
    list.map(acc => {
      this.employees.push('All');
      _.forEach(acc.employeeName, (o, k) => {
        if (o === null) {
          acc.employeeName[k] = 'N/A';
        }
        this.employees.push(acc.employeeName[k]);
      });
      acc.accountTotal = _.sum(acc.amount);
    });
    this.employees = _.uniq(this.employees);

    return list;
  }

  applyFilter(input) {
    if (input.value === 'All') {
      this.filteredList = this.accountList;
    }else {
      this.filteredList = this.accountList;
      const list = _.filter(this.filteredList, {employeeName: [input.value]});
      this.filteredList = list.map((acc, i) => {
        const employee: EmpAccount = {accountId: acc.accountId, accountName: acc.accountName, employeeId: [], employeeName: [], amount: []};
        acc.employeeName.map((emp, index) => {
          if (emp === input.value) {
            employee.accountId = acc.accountId;
            employee.accountName = acc.accountName;
            employee.employeeName.push(acc.employeeName[index]);
            employee.employeeId.push(acc.employeeId[index]);
            employee.amount.push(acc.amount[index]);
          }
        });
        return employee;
      });
    }
    this.dataSource = this.totals(this.filteredList);

  }
}
