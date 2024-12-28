import React, { useState } from "react";

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
import { customersColumns } from "@/app/_components/sheared/columns";
import useCustomers from "@/app/_hooks/useCustomer";
import AddUsersDialog from "@/app/_components/auth/addUsersDialog";
import DeleteAccount from "@/app/_components/sheared/deleteUsers";

function CustomerTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    secondaryPhone: false,
  });

  const {
    isOpen,
    setIsOpen,

    isDelOpen,
    setIsDelOpen,

    isEditing,
    setIsEditing,

    defaultValues,
    setDefaultValues,

    registerForm,
    registerHandler,
    updateUserHandler,

    deleteHandler,
    setUserId,
    users,
  } = useCustomers();

  const columns = customersColumns({
    setIsAddOpen: setIsOpen as React.Dispatch<React.SetStateAction<boolean>>,
    setIsEditing: setIsEditing as React.Dispatch<React.SetStateAction<boolean>>,
    setValues: setDefaultValues,
    setId: setUserId as React.Dispatch<React.SetStateAction<string>>,
    setIsDelOpen: setIsDelOpen as React.Dispatch<React.SetStateAction<boolean>>,
  });

  // Define the table
  const table = useReactTable({
    columns,
    data: users,
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
        pageSize: 10, // Set the initial page size
      },
    },
  });

  return (
    <>
      <UsersTable
        table={table}
        cb={() => setIsOpen(true)}
        columns={columns}
        users={users}
        title={"Customers"}
        description={"Manage your catering service Customers."}
        actionText={"Add Customer"}
        isAddable={true}
      />

      {/* Form for new add or edit manager. */}
      <AddUsersDialog
        onSubmit={isEditing ? updateUserHandler : registerHandler}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={registerForm}
        title="Customer"
        values={defaultValues}
        setValues={setDefaultValues}
        nidDisabled={isEditing}
        emailDisabled={isEditing}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isCustomer={true}
      />

      {/* delete dialog here. */}
      <DeleteAccount
        sectionTitle={"Customer"}
        handleDelete={deleteHandler}
        setUserId={setUserId}
        isOpen={isDelOpen}
        setIsOpen={setIsDelOpen}
      />
    </>
  );
}

export default CustomerTable;
