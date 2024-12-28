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
import { usersColumns } from "@/app/_components/sheared/columns";
import useUsers from "@/app/_hooks/useUsers";
import AddUsersDialog from "@/app/_components/auth/addUsersDialog";
import DeleteAccount from "@/app/_components/sheared/deleteUsers";

function DeliveryManTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    NID: false,
    secondaryPhone: false,
    address: false,
    addedBy: false,
    addedByRole: false,
  });

  const {
    registerHandler,
    registerForm,
    defaultValues,
    setDefaultValues,
    setUserId,
    setIsOpen,
    isOpen,
    setIsDelOpen,
    isDelOpen,
    isEditing,
    setIsEditing,
    deleteHandler,
    deliveryMans,
  } = useUsers("delivery_man");

  const columns = usersColumns({
    setId: setUserId as React.Dispatch<React.SetStateAction<string>>,
    setIsDelOpen: setIsDelOpen as React.Dispatch<React.SetStateAction<boolean>>,
  });

  // Define the table
  const table = useReactTable({
    columns,
    data: deliveryMans,
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
        users={deliveryMans}
        title={"Delivery Mans"}
        description={"Manage your catering service Delivery Mans."}
        actionText={"Add Delivery Man"}
        isAddable={true}
      />

      {/* Form for new add or edit DeliveryMan. */}
      <AddUsersDialog
        onSubmit={registerHandler}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={registerForm}
        title="Delivery Man"
        values={defaultValues}
        setValues={setDefaultValues}
        nidDisabled={isEditing}
        emailDisabled={isEditing}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* delete dialog here. */}
      <DeleteAccount
        sectionTitle={"Delivery Man"}
        handleDelete={deleteHandler}
        setUserId={setUserId}
        isOpen={isDelOpen}
        setIsOpen={setIsDelOpen}
      />
    </>
  );
}

export default DeliveryManTable;
