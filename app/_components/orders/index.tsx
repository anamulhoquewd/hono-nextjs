"use client";

import { useState } from "react";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import UsersTable from "@/app/_components/sheared/table";
import { ordersColumns } from "@/app/_components/sheared/columns";
import DeleteAlert from "@/app/_components/sheared/deleteAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import useOrders from "@/app/_hooks/useOrders";
import OrdersRegisterForm from "@/app/_components/forms/orderForm";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import useUsers from "@/app/_hooks/useUsers";

function OrderTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    customer: false,
    addedBy: false,
    secondaryPhone: false,
    addedByRole: false,
  });

  const {
    isOpen,
    setIsOpen,
    isEditing,
    setIsEditing,
    registerHandler,
    registerForm,
    defaultValues,
    setDefaultValues,
    isDelOpen,
    setIsDelOpen,
    deleteHandler,
    customers,
    handlePreviousDay,
    handleNextDay,
    filteredOrders,
    selectedDate,
    setSelectedDate,
    totalOrders,
    totalQuantity,
    totalPrice,
    updateOrderHandler,
    setOrderId,
  } = useOrders();

  const { profile } = useUsers();
  const role = profile?.role;

  const columns = ordersColumns({
    setId: setOrderId as React.Dispatch<React.SetStateAction<string>>,
    setIsAddOpen: setIsOpen as React.Dispatch<React.SetStateAction<boolean>>,
    setIsEditing: setIsEditing as React.Dispatch<React.SetStateAction<boolean>>,
    setIsDelOpen: setIsDelOpen as React.Dispatch<React.SetStateAction<boolean>>,
    setValues: setDefaultValues as React.Dispatch<React.SetStateAction<any>>,
  });

  // Define the table
  const table = useReactTable({
    data: filteredOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 20, // Set the initial page size
      },
    },
  });

  return (
    <>
      <UsersTable
        table={table}
        cb={() => setIsOpen(true)}
        columns={columns}
        users={filteredOrders}
        title={"Orders"}
        description={"Manage your catering service Orders."}
        actionText={"Add Order"}
        isAddable={role !== "delivery_man" ? true : false}
      >
        {(role === "admin" || role === "manager") && (
          <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
            <Button onClick={handlePreviousDay} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 sm:w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 hidden sm:block" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleNextDay} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </UsersTable>

      {/* Order Summary */}
      {filteredOrders.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="sm:grid sm:grid-cols-5 space-y-2 sm:space-y-0">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Orders:
                </span>
                <span className="text-lg font-semibold">
                  {totalOrders}
                </span>
              </div>
              <Separator orientation="vertical" className="m-auto" />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Quantity:
                </span>
                <span className="text-lg font-semibold">
                  {totalQuantity}
                </span>
              </div>
              <Separator orientation="vertical" className="m-auto" />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Price:
                </span>
                <span className="text-lg font-semibold">
                  {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* register manager and edit existing manager. */}
      <OrdersRegisterForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setDefaultValues={setDefaultValues}
        onSubmit={isEditing ? updateOrderHandler : registerHandler}
        customers={customers}
        form={registerForm}
        defaultValues={defaultValues}
      />

      {/* delete dialog here. */}
      <DeleteAlert
        isOpen={isDelOpen}
        setOpen={setIsDelOpen}
        cb={deleteHandler}
      />
    </>
  );
}

export default OrderTable;
