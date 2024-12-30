import PaginationForTable from "@/app/_components/sheared/paginationForTable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Plus } from "lucide-react";
import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { CustomersType, OrdersType, UsersType } from "@/types";
import { format } from "date-fns";

interface Props {
  table: any;
  cb?: () => void;
  columns: any;
  users: UsersType[] | CustomersType[] | OrdersType[];
  title: string;
  description: string;
  actionText?: string;
  isAddable?: boolean;
  children?: React.ReactNode;
}

function UsersTable({
  table,
  columns,
  users,
  title,
  description,
  actionText,
  isAddable = false,
  children,
  cb,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {children}
        {isAddable && (
          <Button onClick={cb} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {actionText}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row items-center py-4 gap-2">
          <Input
            placeholder="Search by Name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:ml-auto sm:w-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {table
                .getAllColumns()
                .filter(
                  (column: {
                    id: string;
                    getCanHide: () => boolean;
                    getIsVisible: () => boolean;
                    toggleVisibility: (value: boolean) => void;
                  }) => column.getCanHide()
                )
                .map(
                  (column: {
                    id: string;
                    getCanHide: () => boolean;
                    getIsVisible: () => boolean;
                    toggleVisibility: (value: boolean) => void;
                  }) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="cursor-pointer capitalize transition-all duration-300 sm:hover:bg-white-2x"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  }
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: { id: string; headers: any[] }) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map(
                    (header: {
                      id: string;
                      isPlaceholder: boolean;
                      column: any;
                    }) => {
                      return (
                        <TableHead
                          className="font-semibold text-muted-foreground text-center px-4 py-2"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                (
                                  header as {
                                    id: string;
                                    isPlaceholder: boolean;
                                    column: any;
                                    getContext: () => any;
                                  }
                                ).getContext()
                              )}
                        </TableHead>
                      );
                    }
                  )}
                </TableRow>
              ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map(
                  (row: {
                    id: string;
                    getIsSelected: () => boolean;
                    getVisibleCells: () => any[];
                  }) => {
                    return (
                      <TableRow
                        className="cursor-pointer text-center"
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const cellValue =
                            (cell.column.id === "price" ||
                              cell.column.id === "total") &&
                            cell.getValue() !== undefined
                              ? parseFloat(cell.getValue()).toFixed(2)
                              : cell.column.id === "date" &&
                                  cell.getValue() !== undefined
                                ? format(cell.getValue(), "yyyy-MM-dd")
                                : flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  );

                          return (
                            <TableCell
                              key={cell.id}
                              className="text-black-solid"
                            >
                              {cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  }
                )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No result found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {users.length > 0 && <PaginationForTable table={table} />}
      </CardContent>
    </Card>
  );
}

export default UsersTable;
