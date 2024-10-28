import { Component } from '@angular/core';
import { employeeTableColumns } from './constants/table-columns';
import { IListTableColumns, IListTableConfig } from './components/list-table/list-table.interface';
import { employeeTableConfigClient, employeeTableConfigServer,  } from './constants/table-config';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  employeeTableDataClient: any[] = [];
  employeeTableDataServer: any[] = [];
  employeeTableColumns: IListTableColumns[] = employeeTableColumns;
  employeeTableConfigClient: IListTableConfig = employeeTableConfigClient;
  employeeTableConfigServer: IListTableConfig = employeeTableConfigServer;
  currentPageNumber: number = 1;
  pageSize!: number;
  checkedRowsClient: any[] = [];
  checkedRowsServer: any[] = [];

  constructor(private _employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.pageSize = employeeTableConfigServer?.pagination?.pageSizeOptions[0] ? employeeTableConfigServer.pagination.pageSizeOptions[0] : 10; 
    this.getTableData(this.currentPageNumber, this.pageSize);
    this.employeeTableDataClient = this.getTableDataClient(1, 21);
  }

  getTableDataClient(pageNumber: number, pageSize: number): any {
    this._employeeService.getEmployeeList(pageNumber, pageSize).subscribe((response: any) => {
      this.employeeTableDataClient = response.data;
    })
  }

  /**
   *
   * @author Pradeep V
   * @param {number} pageSize
   * @param {number} pageOffset
   * @memberof AppComponent
   * @description Simulates an API call, and retrieves a sample table data after a small delay
   */
  getTableData(pageNumber: number, pageSize: number) {
    this._employeeService.getEmployeeList(pageNumber, pageSize).subscribe((response: any) => {
      this.employeeTableDataServer = response.data;
      this.employeeTableConfigServer!.pagination!.totalRecords = response.totalRecords;
      // this.employeeTableConfig!.pagination!.pageSize = pageSize;
    })
  }


  /**
   *
   * @author Pradeep V
   * @param {*} deletedRow
   * @memberof AppComponent
   * @description Deletes the emitted row from the data array
   */
  handleDeleteRow(deletedRow: any) {
    this.employeeTableDataServer = this.employeeTableDataServer.filter(x => (x.id !== deletedRow.id));
    if (this.employeeTableDataServer.length === 0 && this.currentPageNumber > 1) {
      this.currentPageNumber--;
      this.getTableData(this.currentPageNumber, this.pageSize);
    }
  }

  /**
   *
   * @author Pradeep V
   * @param {number} pageNumber
   * @memberof AppComponent
   * @description Handles previous page click event
   */
  handlePreviousPageClick(pageNumber: number) {
    this.currentPageNumber = pageNumber;
    this.getTableData(this.currentPageNumber, this.pageSize);
  }

  /**
   *
   * @author Pradeep V
   * @param {number} pageNumber
   * @memberof AppComponent
   * @description Handles next page click event
   */
  handleNextPageClick(pageNumber: number) {
    this.currentPageNumber = pageNumber;
    this.getTableData(this.currentPageNumber, this.pageSize);
  }

  /**
   *
   * @author Pradeep V
   * @param {number} pageNumber
   * @memberof AppComponent
   * @description Handles go to a specific page click event
   */
  handleGoToPage(pageNumber: number) {
    this.currentPageNumber = pageNumber;
    this.getTableData(this.currentPageNumber, this.pageSize);
  }

  onPageSizeChange(event: number) {
    this.pageSize = event;
    this.currentPageNumber = 1;
    this.getTableData(this.currentPageNumber, this.pageSize);
  }

  /**
   *
   * @author Pradeep V
   * @param {*} checkedEvent
   * @memberof AppComponent
   * @description Handles checked row event
   */
  handleCheckedRowClient(checkedRowsEvent: any) {
    this.checkedRowsClient = [];
    checkedRowsEvent.forEach((row: any) => {
      const index = this.checkedRowsClient.findIndex(x => x.id === row.id);
      if (index === -1) {
        this.checkedRowsClient.push(row);
      }
    });
  }

  handleCheckedRowServer(checkedRowsEvent: any) {
    this.checkedRowsServer = [];
    checkedRowsEvent.forEach((row: any) => {
      const index = this.checkedRowsServer.findIndex(x => x.id === row.id);
      if (index === -1) {
        this.checkedRowsServer.push(row);
      }
    });
  }
}
