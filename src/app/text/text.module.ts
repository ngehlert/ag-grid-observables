import {NgModule} from '@angular/core';
import {AgGridTextCellRendererComponent} from './text.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        AgGridTextCellRendererComponent,
    ],
    declarations: [
        AgGridTextCellRendererComponent,
    ],
})
class AgGridTextCellRendererModule {}

export {AgGridTextCellRendererModule};
