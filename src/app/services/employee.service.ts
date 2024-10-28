import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }

  employeeDetails = [

  ]

  getEmployeeList(pageNumber: number, pageSize: number): Observable<any> {
    // Backend API Logic is implemented here.
    const resultArray = {
      data: this.employeeDetails.slice((pageNumber * pageSize) - pageSize, pageNumber * pageSize),
      totalRecords: this.employeeDetails.length
    };
    return of(resultArray).pipe(delay(200));
  }
}
