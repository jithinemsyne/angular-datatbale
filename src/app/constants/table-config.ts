import { IListTableConfig } from "../components/list-table/list-table.interface";

export const employeeTableConfigClient: IListTableConfig = {
  header: {
    display: true,
    title: 'List of Customer(s)',
  },
  pagination: {
    enabled: false,
    totalRecords: 0,
    pageSizeOptions: [5, 10, 15, 20, 50],
  },
  mode: 'client'
}

export const employeeTableConfigServer: IListTableConfig = {
  header: {
    display: true,
    title: 'List of Customer(s)',
  },
  pagination: {
    enabled: true,
    totalRecords: 0,
    pageSizeOptions: [5, 10, 15, 20, 50],
  },
  mode: 'server'
}