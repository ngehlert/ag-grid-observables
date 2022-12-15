import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ICellRendererAngularComp} from '@ag-grid-community/angular';
import {ICellRendererParams} from '@ag-grid-community/core';
import {Observable, of} from 'rxjs';

@Component({
    selector: 'grid-text-renderer',
    template: '<span>{{value|async}}</span>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class AgGridTextCellRendererComponent implements ICellRendererAngularComp {
    public value: Observable<string> = of('');
    private params!: ICellRendererParams;

    public agInit(params: ICellRendererParams): void {
        this.params = params;
        this.value = params.value;
    }

    public refresh(params: ICellRendererParams): boolean {
        this.agInit(params);

        return true;
    }
}

export {AgGridTextCellRendererComponent};
