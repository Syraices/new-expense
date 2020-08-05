export class EmpAccount{
  constructor(
    public accountId?: string,
    public accountName?: string,
    public employeeId?: string,
    public employeeName?: string,
    public amounts?: Array<number>
  ){}
}