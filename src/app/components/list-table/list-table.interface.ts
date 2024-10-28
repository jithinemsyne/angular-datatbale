export interface IListTableColumns {
  title: string;
  bindValue: string;
  type: 'text' | 'delete' | 'checkbox' | 'mat-menu' | 'radio' | 'dropdown' |'selectbox' | 'date';
  isSelectAll?: boolean;
  actions?: IListTableAction[];
  editable: boolean;
  options?: { value: string; label: string }[];
}

export interface IListTableAction {
  label: string;
  icon: string;
  action: 'view' | 'update' | 'delete' |'add';
}

export interface IListTableConfig {
  header?: ITableHeader;
  pagination?: IPagination;
  mode?: 'client' | 'server';
}

export interface IListTableDefaultConfig extends IListTableConfig {
  header: ITableHeader;
  pagination: IPagination;
  mode: 'client' | 'server';
}

export interface ITableHeader {
  display: boolean;
  title: string;
}

export interface IPagination {
  enabled: boolean;
  // maxPageIndex: number;
  totalRecords:number;
  pageSizeOptions: number[];
}
