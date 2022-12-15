import {CellClassParams, ColDef, ColumnState, GridOptions, PostSortRowsParams, RowNode} from '@ag-grid-community/core';
import {Injectable} from '@angular/core';
import {first, forkJoin, isObservable, Observable} from "rxjs";

@Injectable()
export class GridHelperService {

  constructor() {
  }

  public getDefaultOptions(): GridOptions {
    let skipNextPostSort: boolean = false;

    return {
      pagination: true,
      defaultColDef: this.getDefaultColumnDefinition(),
      postSortRows: (params: PostSortRowsParams): void => {
        console.log('post sort triggered');
        if (skipNextPostSort) {
          skipNextPostSort = false;

          return;
        }
        const columnStates: Array<ColumnState> = params.columnApi.getColumnState();

        columnStates
          .filter((state: ColumnState) => !!state.sort)
          .forEach((state: ColumnState) => {
            const observables: Array<Observable<unknown>> = [];
            params.api.forEachNode((node: RowNode) => {
              const value: unknown = params.api.getValue(state.colId || '', node);
              if (isObservable(value)) {
                value.subscribe({
                  next: (result: unknown) => {
                    storeResolvedObservableValue(
                      value,
                      result,
                    );
                  },
                });
                observables.push(value);
              }
            });
            if (observables.length) {
              forkJoin(observables).subscribe({
                next: () => {
                  /**
                   * If we re-sort after all observable data for a column sort is resolved we don't want
                   * to execute postSort again (infinite loop)
                   */
                  skipNextPostSort = true;
                  params.api.refreshClientSideRowModel('sort');
                },
              });
            }
          });
      },
    };
  }

  public getDefaultColumnDefinition(): ColDef {
    const loadingStateByEntry: Map<unknown, boolean> = new Map<unknown, boolean>();
    const updateTableState: (params: CellClassParams) => void = (params: CellClassParams): void => {
      loadingStateByEntry.set(params.value, false);
      setTimeout(() => {
        params.api.refreshCells({
          suppressFlash: true,
          rowNodes: [params.node],
          columns: [params.column],
        });
      });
    };

    return {
      sortable: true,
      sortingOrder: ['asc', 'desc'],
      resizable: true,
      minWidth: 120,
      cellClassRules: {
        'grid-table-cell-loading': (params: CellClassParams): boolean => {
          const mapEntry: boolean | undefined = loadingStateByEntry.get(params.value);
          if (mapEntry !== undefined) {
            return mapEntry;
          }

          // Handle observables
          if (isObservable(params.value)) {
            loadingStateByEntry.set(params.value, true);
            params.value.pipe(first()).subscribe({
              next: (): void => updateTableState(params),
              error: (): void => updateTableState(params),
            });

            return true;
          }

          return false;
        },
      },
    };
  }
}

const valueByObservable: WeakMap<Observable<unknown> | Promise<unknown>, unknown>
  = new WeakMap<Observable<unknown> | Promise<unknown>, unknown>();
export function storeResolvedObservableValue(
  observable: Observable<unknown> | Promise<unknown>,
  value: unknown,
): void {
  valueByObservable.set(observable, value);
}

export function getStoredResolvedObservableValue(observable: Observable<unknown> | Promise<unknown>): unknown {
  return valueByObservable.get(observable);
}

export function getObservableNumberComparator(): (valueA: any, valueB: any, nodeA: RowNode, nodeB: RowNode, isInverted: boolean) => number {
  return (valueA: any, valueB: any, _nodeA: RowNode, _nodeB: RowNode) => {
    if (isObservable(valueA) || isObservable(valueB)) {
      return (getStoredResolvedObservableValue(valueA) as number || 0) - (getStoredResolvedObservableValue(valueB) as number || 0);
    }

    return valueA - valueB;
  };
}
