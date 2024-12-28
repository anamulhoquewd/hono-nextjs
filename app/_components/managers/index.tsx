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
import AddUsersDialog from "../auth/addUsersDialog";
import DeleteAccount from "../sheared/deleteUsers";

function ManagerTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    secondaryPhone: false,
    address: false,
  });

  const {
    registerHandler,
    registerForm,
    managers,
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
  } = useUsers("manager");

  const columns = usersColumns({
    setId: setUserId as React.Dispatch<React.SetStateAction<string>>,
    setIsDelOpen: setIsDelOpen as React.Dispatch<React.SetStateAction<boolean>>,
  });

  // Define the table
  const table = useReactTable({
    columns,
    data: managers,
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
        pageSize: 5, // Set the initial page size
      },
    },
  });

  return (
    <>
      <UsersTable
        table={table}
        cb={() => setIsOpen(true)}
        columns={columns}
        users={managers}
        title={"Managers"}
        description={"Manage your catering service Managers."}
        actionText={"Add Manager"}
        isAddable={true}
      />

      {/* Form for new add or edit manager. */}
      <AddUsersDialog
        onSubmit={registerHandler}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={registerForm}
        title="Manager"
        values={defaultValues}
        setValues={setDefaultValues}
        nidDisabled={isEditing}
        emailDisabled={isEditing}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* delete dialog here. */}
      <DeleteAccount
        sectionTitle={"Manager"}
        handleDelete={deleteHandler}
        setUserId={setUserId}
        isOpen={isDelOpen}
        setIsOpen={setIsDelOpen}
      />
    </>
  );
}

export default ManagerTable;
