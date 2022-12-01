import { Component } from '@angular/core';
import {ColDef, GridOptions} from '@ag-grid-community/core';
import {delay, Observable, of, share} from 'rxjs';
import {getObservableNumberComparator, GridHelperService} from './grid-helper.service';
import {AgGridTextCellRendererComponent} from './text/text.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

  constructor(
    private gridHelperService: GridHelperService,
  ) {
    this.rowData = [
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

  private getRandomNumberObservable(): Observable<number> {
    return of(Math.trunc(Math.random() * 10_000)).pipe(
      delay(5_000),
      share()
      );
  }
}

interface ITableEntry {
  car: {
    model: string;
    make: string;
  },
  pricingData?: Observable<number>;
}
