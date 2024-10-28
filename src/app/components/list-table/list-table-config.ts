import { IListTableDefaultConfig } from "./list-table.interface";

export const defaultListTableConfig: IListTableDefaultConfig = {
  header: {
    display: false,
    title: 'Table Title',
  },
  pagination: {
    enabled: false,
    totalRecords:0,
    pageSizeOptions: [],
  },
  mode: 'client'
}