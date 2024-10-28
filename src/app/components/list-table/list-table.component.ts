import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { IListTableAction, IListTableColumns, IListTableConfig } from './list-table.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { deleteRowAnimation } from './list-table.animations';
import Swal from 'sweetalert2';
import { defaultListTableConfig } from './list-table-config';




@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss'],
  animations: [deleteRowAnimation]
})
export class ListTableComponent {

  _defaultConfig: any = defaultListTableConfig;  // refactor

  @Input() data: any[] = []; // create an interface later
  @Input() columns: IListTableColumns[] = [];
  @Input()
  set config(value: IListTableConfig) {
    this._defaultConfig = { ...defaultListTableConfig, ...value };
  }
  get config(): IListTableConfig {
    return this._defaultConfig;
  }
  
  @Output() deletedRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() previousPageClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextPageClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() goToPageClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() checkedRow: EventEmitter<any> = new EventEmitter<any>();

  pageNumber: number = 1;
  maxPageNumber: number = 1;
  pageSize!: number;
  rowStartIndex: number = 0;
  rowEndIndex: number = 0;
  previousPageDisabled: boolean = true;
  nextPageDisabled: boolean = false;
  selection = new SelectionModel<any>(true, []);
  currentMenuItem: any = null;
  editRowIndices: number[] = [];
  originalValues: any[] = [];
  tableData: any[] = [];
  selectedRowList: any[] = [];
  idCounter: number = 1;
  constructor(private renderer: Renderer2) {
    this.renderer.listen('document', 'click', (event) => this.onClickOutside(event));
  }
  ngOnInit() {
    if (this.data.length > 0) {
      // Get the maximum existing ID from the data
      const maxId = Math.max(...this.data.map(item => item.id), 0);
      this.idCounter = maxId + 1; // Start from the next available ID
    }
    console.log(this.data);
    console.log(this.columns);   
    

    
  }
  

  ngOnChanges(): void {
    this.data = this.data ?? []; // Prevents data becoming undefined or null
    this.handlePaginaion(this.config.mode ? this.config.mode : 'client') // refactor later using new interface
    this.updateExsistingSelection(this.tableData, this.selectedRowList);
  }

  handlePaginaion(mode: string): void {
    if (mode === 'client' && this.config?.pagination?.enabled && this.data?.length > 0) {
      this.pageSize = this.pageSize ?? this.config.pagination.pageSizeOptions[0];
      this.maxPageNumber = Math.ceil(this.data.length / this.pageSize);
      this.updatePaginatedData();
    } else if (mode === 'server' && this.config?.pagination?.enabled && this.data.length > 0) {
      this.pageSize = this.pageSize ?? this.config.pagination.pageSizeOptions[0];
      this.maxPageNumber = Math.ceil(this.config.pagination.totalRecords / this.pageSize) ?? 0;
      this.tableData = JSON.parse(JSON.stringify(this.data));
      this.rowStartIndex = (this.pageNumber * this.pageSize) - this.pageSize;
      this.rowEndIndex = this.rowStartIndex + this.tableData.length;
      this.managePaginationButtons();
    } else {
      this.rowStartIndex = 0;
      this.rowEndIndex = 0;
      this.tableData = this.data ? [...this.data] : [];
    }
  }

  getPaginatedData(pageNumber: number, pageSize: number): any {
    const resultData = {
      data: this.data.slice((pageNumber * pageSize) - pageSize, pageNumber * pageSize),
      maxPageNumber: Math.ceil(this.data.length / pageSize),
      totalRecords: this.data.length
    };
    return (resultData);
  }

  onPageSizeChange(event: any) {
    this.pageSize = parseInt(event, 10);
    this.pageNumber = 1;
    this.maxPageNumber = Math.ceil(this.data.length / this.pageSize);
    if (this.config.mode === 'client') {
      this.updatePaginatedData();
    } else {
      this.pageSizeChange.emit(this.pageSize);
    }
    this.updateExsistingSelection(this.tableData, this.selectedRowList);
  }

  /**
   *
   * @author Pradeep V
   * @memberof ListTableComponent
   * @description For navigating the previous page
   */
  previousPage() {
    const goToPreviousPage = () => {
      this.pageNumber--;
      if (this.config.mode === 'client') {
        this.updatePaginatedData();
      } else {  // add actual condition | DNC
        this.previousPageClick.emit(this.pageNumber);
      }
      this.updateExsistingSelection(this.tableData, this.selectedRowList);
    }
    if (this.editRowIndices.length > 0) {
      Swal.fire({
        title: "There are unsaved changes.",
        text: "Do you want to save the changes and proceed?",
        showCancelButton: true,
        confirmButtonText: "Save",
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveAll();
          goToPreviousPage();
        }
      });
    } else {
      goToPreviousPage();
    }
  }

  /**
   *
   * @author Pradeep V
   * @memberof ListTableComponent
   * @description For navigating the next page
   */
  nextPage() {
    const goToNextPage = () => {
      this.pageNumber++;
      if (this.config.mode === 'client') {
        this.updatePaginatedData();
      } else { // add actual condition | DNC
        this.nextPageClick.emit(this.pageNumber);
      }
      this.updateExsistingSelection(this.tableData, this.selectedRowList);
    }
    if (this.editRowIndices.length > 0) {
      Swal.fire({
        title: "There are unsaved changes.",
        text: "Do you want to save the changes and proceed?",
        showCancelButton: true,
        confirmButtonText: "Save",
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveAll();
          goToNextPage();
        }
      });
    } else {
      goToNextPage();
    }
  }

  /**
   *
   * @author Pradeep V
   * @param {*} event
   * @memberof ListTableComponent
   * @description For navigating to a specific page
   */
  goToPage(event: any) {
    const goToPageNumber = parseInt(event.target.value);
    this.pageNumber = goToPageNumber < 1 ? 1 :
      goToPageNumber > this.maxPageNumber ? this.maxPageNumber : goToPageNumber;
    if (this.config.mode === 'client') {
      this.updatePaginatedData();
    } else {
      this.goToPageClick.emit(this.pageNumber);
    }
    this.updateExsistingSelection(this.tableData, this.selectedRowList);
  }

  updatePaginatedData(): void {
    const response = this.getPaginatedData(this.pageNumber, this.pageSize);
    this.tableData = response.data;
    this.rowStartIndex = (this.pageNumber * this.pageSize) - this.pageSize;
    this.rowEndIndex = this.rowStartIndex + this.tableData.length;
    this.managePaginationButtons();
  }

  /**
   *
   * @author Pradeep V
   * @memberof ListTableComponent
   * @description For enabling and disabling previous page and next page buttons
   */
  managePaginationButtons() {
    this.previousPageDisabled = !(this.pageNumber > 1);
    this.nextPageDisabled = this.pageNumber === this.maxPageNumber;
  }

  onRowDoubleClick(item: any, index: number) {
    this.originalValues[index] = { ...item };
    this.editRowIndices.push(index);
  }

  saveEdit(item: any, index: number) {
    this.update(item, index);
    const rowIndex = this.editRowIndices.indexOf(index);

    if (rowIndex !== -1) {
      this.editRowIndices.splice(rowIndex, 1);
    }
  }

  cancelEdit(item: any, index: number) {
    Object.assign(item, this.originalValues[index]);
    delete item.originalValue;
    const rowIndex = this.editRowIndices.indexOf(index);
    if (rowIndex !== -1) {
      this.editRowIndices.splice(rowIndex, 1);
    }
  }

  saveAll() {
    this.editRowIndices.forEach(index => {
      const item = this.data[index];
      this.saveEdit(item, index);
    });
    this.editRowIndices = [];
  }

  cancelAll() {
    this.originalValues.forEach((element, index) => {
      this.data[index] = { ...element };
    });
    this.editRowIndices = [];
  }

  hasEditingRows(): boolean {
    return this.editRowIndices.length > 0;
  }

  onKeyDown(event: KeyboardEvent, item: any, index: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit(item, index);
    }
  }
  // this is the button for addding a new row to the table
  onAdd(){
    const newRow = {
      id: this.idCounter++, // Auto-incremented ID
      name: '', // Example input field for name
      dropdownValue: '', // Example dropdown field
      selectValue: '', // Example select box value
      date: { year: null, month: null, day: null }, // Example date picker field
      isNew: true // Flag to differentiate the newly added row
    };
  
    this.data.push(newRow);
    this.tableData = [...this.data]; // Ensures the new data is reflected in the UI
    this.editRowIndices.push(this.data.length - 1); // Add to edit mode to enable inputs for the new row
  }
  

  /**
   * 
   * @author Pradeep V
   * @param {*} row
   * @memberof ListTableComponent
   * @description Emits a single row for handling delete, when user clicks delete button
   */
  deleteRow(row: any) {
    if(this.config.mode==='client'){
      this.data = this.data.filter(item => item.id !== row.id);
      this.updatePaginatedData(); 
     
    }else{
    this.deletedRow.emit(row);
    
    }
    this.tableData = [...this.data]; 
  }
  viewRow(row: any) {
    console.log('Add clicked for', row);
  }

  update(row: any, index: number) {
    if (this.editRowIndices.includes(index)) {
      console.log('Update clicked for', row);
    }
  }

  handleAction(action: IListTableAction, item: any, index: number) {
    switch (action.action) {
      case 'view':
        this.viewRow(item);
        break;
      case 'update':
        this.onRowDoubleClick(item, index);
        break;
      case 'delete':
        this.deleteRow(item);
        break;
        case 'add':
        this.onAdd();
        break;
    }
    item.menuVisible = false;
  }

  toggleMenu(item: any) {
    this.data.forEach((row) => {
      if (row !== item) {
        row.menuVisible = false;
      }
    });

    item.menuVisible = !item.menuVisible;
  }

  onClickOutside(event: Event) {
    this.data.forEach((item) => {
      const target = event.target as HTMLElement;
      if (item.menuVisible && !target.closest('.menu-trigger-button') && !target.closest('.custom-menu')) {
        item.menuVisible = false;
      }
    });
  }

  hasUnsavedChanges(currentItem: any, originalItem: any): boolean {
    if (!currentItem || !originalItem) {
      return false;
    }
    for (const key in currentItem) {
      if (currentItem.hasOwnProperty(key) && originalItem.hasOwnProperty(key)) {
        if (currentItem[key] !== originalItem[key]) {
          return true; // unsaved changes exists
        }
      }
    }
    return false; // no unsaved changes
  }

  /**
   *
   * @author Pradeep V
   * @param {*} event
   * @param {*} row
   * @memberof ListTableComponent
   * @description For emitting the checked rows
   */
  onCheckboxChange(event: any, row: any) {
    event ? this.selection.toggle(row) : null;
    if (this.selection.isSelected(row)) {
      this.selectedRowList = this.addCheckedRows(this.selectedRowList, [row]);
    } else {
      this.selectedRowList = this.removeCheckedRows(this.selectedRowList, [row]);
    }
    this.checkedRow.emit(this.selectedRowList);
  }

  /**
   *
   * @author Pradeep V
   * @memberof ListTableComponent
   * @description For select all checkbox (master checkbox)
   */
  onSelectAllCheckboxChange() {
    if (this.isAllSelected()) {
      this.selectedRowList = this.removeCheckedRows(this.selectedRowList, this.selection.selected)
      this.selection.clear()
    } else {
      this.tableData.forEach(row => this.selection.select(row));
      this.selectedRowList = this.addCheckedRows(this.selectedRowList, this.selection.selected);
    }
    this.checkedRow.emit(this.selectedRowList);
  }

  /**
   *
   * @author Pradeep V
   * @return {*} 
   * @memberof ListTableComponent
   * @description Returns true if all checkboxes are selected
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableData.length;
    return numSelected === numRows;

  }

  addCheckedRows(originalItems: any[], selectedItems: any[]) {
    const filteredItems = selectedItems.filter(newItem =>
      !originalItems.some(item => item.id === newItem.id));
    return [...originalItems, ...filteredItems];
  }

  removeCheckedRows(originalItems: any[], deselectedItems: any[]) {
    const filteredItems = originalItems.filter(item => !deselectedItems.some(newItem => item.id === newItem.id));
    return [...filteredItems]
  }

  updateExsistingSelection(pageData: any[], selectedItems: any[]) {
    this.selection.clear();
    const filteredItems = pageData.filter(item => selectedItems.some(selectedItem => item.id === selectedItem.id));
    filteredItems.forEach(row => this.selection.select(row));
  }

  // date formating json to string
  formatDate(dateObject: { year: number, month: number, day: number }): string {
    const year = dateObject.year;
    const month = dateObject.month < 10 ? `0${dateObject.month}` : dateObject.month;
    const day = dateObject.day < 10 ? `0${dateObject.day}` : dateObject.day;
    return `${day}/${month}/${year}`;
  }

}
