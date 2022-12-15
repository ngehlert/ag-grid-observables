import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GridHelperService} from './grid-helper.service';
import {AgGridModule} from '@ag-grid-community/angular';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {ServerSideRowModelModule} from '@ag-grid-enterprise/server-side-row-model';
import {ClipboardModule} from '@ag-grid-enterprise/clipboard';
import {ModuleRegistry} from '@ag-grid-community/core';
import {AgGridTextCellRendererModule} from './text/text.module';
import {MenuModule} from '@ag-grid-enterprise/menu';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {CsvExportModule} from '@ag-grid-community/csv-export';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ServerSideRowModelModule,
  ClipboardModule,
  MenuModule,
  ExcelExportModule,
  CsvExportModule,
]);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    AgGridTextCellRendererModule,
  ],
  providers: [
    GridHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
