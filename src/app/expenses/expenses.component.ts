import { Component, OnInit, ViewChild } from '@angular/core';
// import { EmpAccount } from '../emp-account.model';
import { HttpClient } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface EmpAccount{
  accountId?: string;
  accountName?: string;
  employeeId?: string;
  employeeName?: string[];
  amounts: number[];
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
  // @ViewChild(MatTable) table: MatTable<any>;
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
          // const employ = this.accountList[account].employeeName.findIndex(employ => employ === data[acc].employeeName)
          // console.log(account)  
          if (this.accountList[account]){
              // console.log(this.accountList[account])
              // console.log(typeof(this.accountList[account].amounts))
              this.accountList[account].amounts.push(data[acc].amount)
           
                if( data[acc].employeeName ){
                  this.accountList[account].employeeName.push(data[acc].employeeName)
                  // console.log(this.accountList[account].amounts[num])
                }
                else{
                  this.accountList[account].employeeName.push('N/A');
                }
                  this.accountList[account].accountTotal += data[acc].amount;  
              
          }else{
            // if(data[acc].employeeName){
              this.accountList.push(
                  {
                    accountId: data[acc].accountId,
                    accountName: data[acc].accountName,
                    employeeId: data[acc].employeeId,
                    employeeName: [data[acc].employeeName],
                    amounts: [data[acc].amount],
                    accountTotal: data[acc].amount
                  }
              )
            // }else{
            //   this.accountList.push(
            //     {
            //       accountId: data[acc].accountId,
            //       accountName: data[acc].accountName,
            //       employeeId: data[acc].employeeId,
            //       employeeName: ['N/A'],
            //       amounts: [data[acc].amount],
            //       accountTotal: data[acc].amount
            //     }
              // )
            // }
          }
        this.dataSource = this.accountList;
        // for(const acc in this.accountList){
        //   console.log(this.accountList[1].employeeId);
        // }
       
        // this.table.renderRows();
        }
      }
    )
  }
}
