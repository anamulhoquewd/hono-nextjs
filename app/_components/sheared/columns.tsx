import {
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersType, CustomersType, OrdersType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Package, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

// Define Props Interface
interface ColumnsProps {
  setIsAddOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setIsDelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValues?: (values: UsersType | CustomersType | OrdersType) => void;
  iAmEditor?: boolean;
}

const usersColumns = ({
  setId,
  setIsDelOpen,
}: ColumnsProps): ColumnDef<UsersType>[] => {
  const columns: ColumnDef<UsersType>[] = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <Avatar>
          <AvatarFallback>
            {(row.getValue("name") as string).charAt(0).toUpperCase()}
          </AvatarFallback>
          <AvatarImage src={row.getValue("avatar") as string} />
        </Avatar>
      ),
    },
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "NID",
      header: "NID",
      cell: ({ row }) => <div>{row.getValue("NID")}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setId(row.getValue("_id"));
                setIsDelOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
};

const customersColumns = ({
  setIsAddOpen,
  setIsEditing,
  setValues,
  setId,
  setIsDelOpen,
}: ColumnsProps): ColumnDef<CustomersType>[] => {
  const columns: ColumnDef<CustomersType>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "secondaryPhone",
      header: "Secondary Phone",
      cell: ({ row }) => <div>{row.getValue("secondaryPhone")}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setValues!(row.original);
                setId(row.getValue("_id"));
                setIsAddOpen!(true);
                setIsEditing!(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <Link href={`customers/${row.getValue("_id")}`}>
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                See Orders
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setId(row.getValue("_id"));
                setIsDelOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
};

const ordersColumns = ({
  setIsAddOpen,
  setIsEditing,
  setValues,
  setId,
  setIsDelOpen,
  iAmEditor = true,
}: ColumnsProps): ColumnDef<OrdersType>[] => {
  const columns: ColumnDef<OrdersType>[] = [
    {
      accessorKey: "_id",
      header: "ID",
    },
    {
      accessorKey: "customer",
      header: "Customer ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "secondaryPhone",
      header: "Secondary Phone",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ];

  if (iAmEditor) {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setValues!(row.original);
                console.log(row.original);
                setId(row.getValue("_id"));
                setIsAddOpen!(true);
                setIsEditing!(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setId(row.getValue("_id"));
                setIsDelOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });
  }

  return columns;
};

export { usersColumns, customersColumns, ordersColumns };
