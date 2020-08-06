import { Component, OnInit, ViewChild } from '@angular/core';
// import { EmpAccount } from '../emp-account.model';
import { HttpClient } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface EmpAccount{
  accountId?: string;
  accountName?: string;
  employeeId?: string;
  employeeName?: {name: string, amounts: number[]}[];
  // amounts: number[];
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
          // for (const employName in this.accountList[acc].employeeName){
            // console.log(this.accountList[account].employeeName[0].name)
            // const empName = this.accountList[acc].employeeName.findIndex(employName => employName.name === data[acc].employeeName)
            // console.log(empName);
          // }
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
                    // amounts: [data[acc].amount],
                    accountTotal: data[acc].amount
                  }
              )
            }
            // for(let account in this.accountList){
            //   let nameDouble = []
            //   for(let name in this.accountList[account].employeeName){
            //     if(!this.accountList[account].employeeName[name].name) {
            //       this.accountList[account].employeeName[name].name = 'N/A' ;
            //     }
            //   }
            // }
            this.dataSource = this.accountList;
          }
        }
        )
      }
    }
    
    
    
    
    
    
    // const nameDoubleIndex = this.accountList[account].employeeName.indexOf(this.accountList[account].employeeName[name], +name + 1);
    // if(nameDoubleIndex >= 0 ){
      //   nameDouble.push(nameDoubleIndex);
      // }
      
      // for(const name in nameDouble){
        //   this.accountList[account].employeeName[name] = null;
        // }
        
        // console.log(this.accountList)
  
  // for(const acc in this.accountList){
    //   console.log(this.accountList[1].employeeId);
    // }
    
    // this.table.renderRows();

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