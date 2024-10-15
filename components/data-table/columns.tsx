"use client";

import {ColumnDef} from "@tanstack/react-table";

import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";

import {DataTableColumnHeader} from "./data-table-column-header";
import {DataTableRowActions} from "./data-table-row-actions";
import {TaskType} from "@/lib/validations/schema";
import {label_options, priority_options, status_options} from "../filters";

export const columns: ({
    header: ({table}: { table: any }) => JSX.Element;
    id: string;
    enableHiding: boolean;
    cell: ({row}: { row: any }) => JSX.Element;
    enableSorting: boolean
} | {
    header: ({column}: { column: any }) => JSX.Element;
    cell: ({row}: { row: any }) => JSX.Element;
    accessorKey: string
} | {
    filterFn: (row, id, value) => any;
    header: ({column}: { column: any }) => JSX.Element;
    cell: ({row}: { row: any }) => (null | JSX.Element);
    accessorKey: string
} | {
    filterFn: (row, id, value) => any;
    header: ({column}: { column: any }) => JSX.Element;
    cell: ({row}: { row: any }) => JSX.Element;
    accessorKey: string
} | { id: string; cell: ({row}: { row: any }) => JSX.Element; accessorKey: string })[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value: any) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Franchise ID' />
    //   ),
    //   cell: ({ row }) => <div className='w-[80px]'>{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Franchise'/>
        ),
        cell: ({row}) => {
            const label = label_options.find(
                (label) => label.value === row.original.label
            );

            return (
                <div className='flex space-x-2'>
                    <span className='max-w-[500px] truncate font-medium'>
            {row.getValue("title")}
          </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Status'/>
        ),
        cell: ({row}) => {
            const status = status_options.find(
                (status) => status.value === row.getValue("status")
            );

            if (!status) {
                return null;
            }

            return (
                <div className='flex w-[100px] items-center'>
                    {status.icon && (
                        <status.icon className='mr-2 h-4 w-4 text-muted-foreground'/>
                    )}
                    <span>{status.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // current orders
    {
        accessorKey: 'current_orders',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Current Orders'/>
        ),
        cell: ({row}) => {
            return (
                <div className='flex w-[100px] items-center'>
                    <span>{row.getValue('current_orders')}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "Actions",
        id: "actions",
        cell: ({row}) => <DataTableRowActions row={row}/>,
    },
];
