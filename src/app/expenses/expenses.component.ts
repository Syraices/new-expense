import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface EmpAccount{
  accountId?: string;
  accountName?: string;
  employeeId?: string;
  employeeName?: {name: string, amounts: number[]}[];
  
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
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExpensesComponent implements OnInit {

  accountList: EmpAccount[] = [];
  displayedColumns: string[] = [
    'accountName', 'accountTotal'
  ];
  dataSource: EmpAccount[] = [];
  expandedAccount: EmpAccount | null;
  
  constructor(private httpClient: HttpClient) { }
  
  ngOnInit(): void {
    this.httpClient.get('assets/data.json')
    .subscribe(
      data => {
        for(const acc in data){
          const account = this.accountList.findIndex(account => account.accountId === data[acc].accountId)
      
          if(!data[acc].employeeName){
            data[acc].employeeName = 'N/A'
          }
          if (this.accountList[account]){       
            const matching = this.accountList[account].employeeName.findIndex(name => name.name === data[acc].employeeName);
          
            if ( matching >= 0){
              this.accountList[account].employeeName[matching].amounts.push(data[acc].amount);          
            }else{
              this.accountList[account].employeeName.push({name: data[acc].employeeName, amounts: [data[acc].amount]});          
            }    
            this.accountList[account].accountTotal += data[acc].amount;             
          }else{
            this.accountList.push(
              {
                accountId: data[acc].accountId,
                accountName: data[acc].accountName,
                employeeId: data[acc].employeeId,
                employeeName: [{name: data[acc].employeeName, amounts: [data[acc].amount]}],
                accountTotal: data[acc].amount
              }
            )
            this.dataSource = this.accountList;
          }
        }
      }
    )
  }
}