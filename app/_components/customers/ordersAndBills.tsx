import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { customerOrdersColumns as columns } from "@/app/_components/sheared/columns";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { OrdersType } from "@/types";
import useOrders from "@/app/_hooks/useOrders";
import UsersTable from "../sheared/table";
import { Separator } from "@/components/ui/separator";
import useCustomers from "@/app/_hooks/useCustomer";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      size="lg"
      className="print:hidden"
    >
      <Printer className="w-4 h-4" />
    </Button>
  );
}

function CustomerOrdersAndBillsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    secondaryPhone: false,
    _id: false,
  });

  const id = useParams().customer as string;
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { getOrdersByCustomer, ordersOfCustomer } = useOrders();
  const { getUserById } = useCustomers();

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    getOrdersByCustomer(id);
    getUserById(id).then((data) => {
      setCustomerDetails(data);
    });
  }, []);

  useEffect(() => {
    setOrders(
      ordersOfCustomer.filter(
        (order: any) =>
          new Date(order.date).getMonth() === currentDate.getMonth() &&
          new Date(order.date).getFullYear() === currentDate.getFullYear()
      )
    );
  }, [ordersOfCustomer]);

  const calculateTotalBill = (orders: any[]) => {
    return orders
      ?.reduce((sum, order) => sum + parseFloat(order.total), 0)
      .toFixed(2);
  };

  const calculateTotalQuantity = (orders: any[]) => {
    return orders?.reduce((sum, order) => sum + order.quantity, 0);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
      setOrders(
        ordersOfCustomer.filter(
          (order: any) =>
            new Date(order.date).getMonth() === newDate.getMonth() &&
            new Date(order.date).getFullYear() === newDate.getFullYear()
        )
      );
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
      setOrders(
        ordersOfCustomer.filter(
          (order: any) =>
            new Date(order.date).getMonth() === newDate.getMonth() &&
            new Date(order.date).getFullYear() === newDate.getFullYear()
        )
      );
    }
    setCurrentDate(newDate);
  };

  // Define the table
  const table = useReactTable({
    columns,
    data: orders,
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
    <div className="mx-auto">
      <div className="mb-8 space-y-4 w-full">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">Orders and Bills #{id}</h1>
          <Separator className="my-4" />
          <div className="grid gap-1">
            <p className="text-lg font-semibold">{`Name : ${customerDetails.name}`}</p>
            <p className="text-muted-foreground">{`Phone : ${customerDetails.phone}`}</p>
            <p className="text-muted-foreground">{`Address : ${customerDetails.address}`}</p>
          </div>
          <PrintButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Quantity
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateTotalQuantity(orders)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateTotalBill(orders)}
            </div>
          </CardContent>
        </Card>
      </div>

      <UsersTable
        table={table}
        columns={columns}
        users={orders}
        title={"Orders and Bills"}
        description={"View your order history and billing information"}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </UsersTable>
    </div>
  );
}

export default CustomerOrdersAndBillsPage;
