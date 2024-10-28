import { IListTableColumns } from "../components/list-table/list-table.interface";

export const employeeTableColumns: IListTableColumns[] = [
  {
    title: '',
    bindValue: '',
    type: 'checkbox',
    isSelectAll: true, 
    editable:false,
    
  },
  {
    title: 'ID',
    bindValue: 'id',
    type: 'text',
    editable:false,
    
  },
  {
    title: 'Name',
    bindValue: 'name',
    type: 'text',
    editable:true,
   
    
  },
  {
    title: 'Designation',
    bindValue: 'designation',
    type: 'text',
    editable:true,
   
  },
  {
    title: 'Dropdown',
    bindValue: 'dropdown',
    type: 'dropdown',
    editable:true,
    options: [
      { value: '1', label: 'Active' },
      { value: '2', label: 'Inactive' },
      { value: '3', label: 'Pending' },
    ],
   
  },
  {
    title: 'Experience', 
    bindValue: 'selectbox', 
    type: 'selectbox', 
    editable: true,
    options: [
      { value: '1yr', label: '1yr Experience' },
      { value: '2yr', label: '2yr Experience' },
      { value: '3yr', label: '3yr Experience' },
    ],
  },
  {
    title: 'From Date',
    bindValue: 'fromDate',
    type: 'date',
    editable: true,
  },
  {
    title: 'To Date',
    bindValue: 'toDate',
    type: 'date',
    editable: true,
  },
  {
    title: 'Action',
    bindValue: '',
    type: 'mat-menu',
    editable:true,
    actions:[
      { label: 'view', icon: 'visibility', action: 'view' },
      { label: 'Update', icon: 'edit', action: 'update' },
      { label: 'Delete', icon: 'delete', action: 'delete' },
      { label: 'Add', icon: 'add', action: 'add' },

    ]
  },
  
]