import { Component, OnInit } from '@angular/core';
// import { EmpAccount } from '../emp-account.model';
import { HttpClient } from '@angular/common/http';

interface EmpAccount{
  accountId?: string;
  accountName?: string;
  employeeId?: string;
  employeeName?: string;
  amounts: number[];
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  accountList: EmpAccount[] = [];
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get('assets/data.json')
    .subscribe(
      data => {
        for(const acc in data){
          const account = this.accountList.findIndex(account => account.accountId === data[acc].accountId)
          // console.log(account)  
          if (this.accountList[account]){
              // console.log(this.accountList[account])
              // console.log(typeof(this.accountList[account].amounts))
              this.accountList[account].amounts.push(data[acc].amount)
          }else{
            this.accountList.push(
              {
                accountId: data[acc].accountId,
                accountName: data[acc].accountName,
                employeeId: data[acc].employeeId,
                employeeName: data[acc].employeeName,
                amounts: [data[acc].amount]
              }
            )
          }
        }
      }
    )
    
    // console.log(this.accountList);
    // this.accountList.push(
    //   new EmpAccount('sdgsd','dsfsd','sdfsdf','ssdfsdf',345)
    // )
  }
}
