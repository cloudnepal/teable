import { Plus } from '@teable-group/icons';
import { useTable } from '@teable-group/sdk/hooks';
import { Button } from '@teable-group/ui-lib/shadcn/ui/button';
import { useCallback } from 'react';
import { Others } from './Others';
import { ViewOperators } from './ViewOperators';

export const GridToolBar: React.FC = () => {
  const table = useTable();

  const addRecord = useCallback(async () => {
    if (!table) {
      return;
    }
    await table.createRecord({});
  }, [table]);

  return (
    <div className="flex items-center gap-2 border-t px-4 py-2 @container/toolbar">
      <Button
        className="h-6 w-6 shrink-0 rounded-full p-0 font-normal"
        size={'xs'}
        variant={'outline'}
        onClick={addRecord}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <div className="mx-2 h-4 w-px shrink-0 bg-slate-200"></div>
      <div className="flex flex-1 justify-between overflow-x-auto scrollbar-none">
        <ViewOperators />
        <Others />
      </div>
    </div>
  );
};