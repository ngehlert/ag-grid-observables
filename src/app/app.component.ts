import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ColDef,
  GridApi,
  GridOptions,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  LoadSuccessParams
} from '@ag-grid-community/core';
import {delay, Observable, of, share} from 'rxjs';
import {getObservableNumberComparator, GridHelperService} from './grid-helper.service';
import {AgGridTextCellRendererComponent} from './text/text.component';
import {AgGridAngular} from "@ag-grid-community/angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('agGrid', {static: true}) public agGrid!: AgGridAngular;
  public columnDefs: Array<ColDef<ITableEntry>> = [
    {
      colId: 'car.model',
      field: 'car.model',
    },
    {
      colId: 'car.make',
      field: 'car.make',
    },
    {
      colId: 'price',
      field: 'pricingData',
      sort: 'desc',
      comparator: getObservableNumberComparator(),
      cellRenderer: AgGridTextCellRendererComponent,
    }
  ];
  public rowData: Array<ITableEntry> = [];
  public gridOptions: GridOptions = this.gridHelperService.getDefaultOptions();
  public serverSideGridOptions: GridOptions = {
    ...this.gridOptions,
    rowModelType: 'serverSide',
  }

  constructor(
    private gridHelperService: GridHelperService,
  ) {
    this.rowData = this.getRandomRowData();
  }

  public ngOnInit(): void {
    this.agGrid.gridReady.subscribe(
      (params: { api: GridApi }) => {
        const api: GridApi = params.api;
        const dataSource: IServerSideDatasource = this.getServerSideDataSource();
        api.setServerSideDatasource(dataSource);
      },
    );
  }

  private getServerSideDataSource(): IServerSideDatasource {
    return {
      getRows: this.getServerSideDataSourceRows.bind(this),
    };
  }

  private getServerSideDataSourceRows(params: IServerSideGetRowsParams): void {
    setTimeout(() => {
      const rowData: Array<ITableEntry> = this.getRandomRowData();
      const successParams: LoadSuccessParams = {
        rowData: rowData,
        rowCount: rowData.length,
      };
      params.success(successParams);
    }, 3000);
  }


  private getRandomNumberObservable(): Observable<number> {
    return of(Math.trunc(Math.random() * 10_000)).pipe(
      delay(5_000),
      share()
      );
  }

  private getRandomRowData(): Array<ITableEntry> {
    return [
      {
        car: {make: 'Toyota', model: 'Celica'},
        pricingData: this.getRandomNumberObservable()
      },
      {
        car: {make: 'Ford', model: 'Mondeo'},
        pricingData: this.getRandomNumberObservable()
      },
      {
        car: {make: 'Porsche', model: 'Boxster'},
        pricingData: this.getRandomNumberObservable()
      },
      {
        car: {make: 'BMW', model: 'M50'},
        pricingData: this.getRandomNumberObservable()
      },
      {
        car: {make: 'Aston Martin', model: 'DBX'},
        pricingData: this.getRandomNumberObservable()
      },
    ]
  }
}

interface ITableEntry {
  car: {
    model: string;
    make: string;
  },
  pricingData?: Observable<number>;
}
