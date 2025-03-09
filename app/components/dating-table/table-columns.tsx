'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { FaTrash } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import {
  TextCell,
  NumberCell,
  SelectCell,
  StarRatingCell,
  TextareaCell,
  FlagsCell,
  FlagHeader,
  platformOptions,
  outcomeOptions,
  relationshipStatusOptions,
  statusOptions
} from './table-cell';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

const columnHelper = createColumnHelper<DatingEntry | NewDatingEntry>();

type UpdateHandlerType = (index: number, id: string, value: any) => void;
type DeleteHandlerType = (index: number) => void;

// Default column sizes
const defaultColumnSizes = {
  person_name: 200,
  age: 80,
  occupation: 180,
  relationship_status: 180,
  platform: 150,
  num_dates: 80,
  total_cost: 100,
  avg_duration: 100,
  hotness: 120,
  rating: 120,
  outcome: 150,
  status: 120,
  red_flags: 200,
  green_flags: 200,
  notes: 250,
  actions: 80,
};

// Default column definition
const defaultColumn = {
  enableResizing: true,
};

export function useTableColumns(
  updateHandler: UpdateHandlerType,
  deleteHandler: DeleteHandlerType
) {
  const columns = [
    columnHelper.accessor('person_name', {
      header: 'Name',
      size: defaultColumnSizes.person_name,
      minSize: 100,
      maxSize: 500,
      cell: ({ row, getValue, column: { id } }) => (
        <TextCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
        />
      ),
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      size: defaultColumnSizes.age,
      minSize: 60,
      maxSize: 150,
      cell: ({ row, getValue, column: { id } }) => (
        <NumberCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          min="18"
          max="100"
          placeholder="Age"
        />
      ),
    }),
    columnHelper.accessor('occupation', {
      header: 'Occupation',
      size: defaultColumnSizes.occupation,
      minSize: 100,
      maxSize: 300,
      cell: ({ row, getValue, column: { id } }) => (
        <TextCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
        />
      ),
    }),
    columnHelper.accessor('relationship_status', {
      header: 'Relationship Status',
      size: defaultColumnSizes.relationship_status,
      minSize: 120,
      maxSize: 300,
      cell: ({ row, getValue, column: { id } }) => (
        <SelectCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          options={relationshipStatusOptions}
        />
      ),
    }),
    columnHelper.accessor('platform', {
      header: 'Platform',
      size: defaultColumnSizes.platform,
      minSize: 100,
      maxSize: 250,
      cell: ({ row, getValue, column: { id } }) => (
        <SelectCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          options={platformOptions}
        />
      ),
    }),
    columnHelper.accessor('num_dates', {
      header: '# of Dates',
      size: defaultColumnSizes.num_dates,
      minSize: 60,
      maxSize: 150,
      cell: ({ row, getValue, column: { id } }) => (
        <NumberCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
        />
      ),
    }),
    columnHelper.accessor('total_cost', {
      header: 'Total Cost ($)',
      size: defaultColumnSizes.total_cost,
      minSize: 80,
      maxSize: 200,
      cell: ({ row, getValue, column: { id } }) => (
        <NumberCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          step="0.01"
        />
      ),
    }),
    columnHelper.accessor('avg_duration', {
      header: 'Avg Duration (hrs)',
      size: defaultColumnSizes.avg_duration,
      minSize: 80,
      maxSize: 200,
      cell: ({ row, getValue, column: { id } }) => (
        <NumberCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          step="0.5"
        />
      ),
    }),
    columnHelper.accessor('hotness', {
      header: 'Hotness',
      size: defaultColumnSizes.hotness,
      minSize: 80,
      maxSize: 200,
      cell: ({ row, getValue, column: { id } }) => (
        <StarRatingCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          colorClass="text-brand-pink-500"
        />
      ),
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      size: defaultColumnSizes.rating,
      minSize: 80,
      maxSize: 200,
      cell: ({ row, getValue, column: { id } }) => (
        <StarRatingCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
        />
      ),
    }),
    columnHelper.accessor('outcome', {
      header: 'Outcome',
      size: defaultColumnSizes.outcome,
      minSize: 100,
      maxSize: 250,
      cell: ({ row, getValue, column: { id } }) => (
        <SelectCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          options={outcomeOptions}
        />
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      size: defaultColumnSizes.status,
      minSize: 80,
      maxSize: 200,
      cell: ({ row, getValue, column: { id } }) => (
        <SelectCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          options={statusOptions}
        />
      ),
    }),
    columnHelper.accessor('red_flags', {
      header: () => <FlagHeader color="text-red-500" label="Red Flags" />,
      size: defaultColumnSizes.red_flags,
      minSize: 120,
      maxSize: 400,
      cell: ({ row, getValue, column: { id } }) => (
        <FlagsCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          flagColor="text-red-500"
        />
      ),
    }),
    columnHelper.accessor('green_flags', {
      header: () => <FlagHeader color="text-green-500" label="Green Flags" />,
      size: defaultColumnSizes.green_flags,
      minSize: 120,
      maxSize: 400,
      cell: ({ row, getValue, column: { id } }) => (
        <FlagsCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          flagColor="text-green-500"
        />
      ),
    }),
    columnHelper.accessor('notes', {
      header: 'Notes',
      size: defaultColumnSizes.notes,
      minSize: 150,
      maxSize: 500,
      cell: ({ row, getValue, column: { id } }) => (
        <TextareaCell
          row={row.original}
          rowIndex={row.index}
          id={id}
          value={getValue()}
          onUpdate={updateHandler}
          placeholder="Add notes..."
        />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      size: defaultColumnSizes.actions,
      minSize: 60,
      maxSize: 120,
      cell: ({ row }) => (
        <button
          onClick={() => deleteHandler(row.index)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Delete entry"
        >
          <FaTrash />
        </button>
      ),
    }),
  ];

  return columns;
} 