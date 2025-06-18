import React, { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function DataTable({ data, columns, searchField }) {
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {searchField && (
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={`Search ${searchField}...`}
                        />
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="bg-gray-50">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="border-t hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
          </span>
                </div>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default DataTable;