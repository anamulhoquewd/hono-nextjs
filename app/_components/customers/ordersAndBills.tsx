import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { OrdersType } from "@/types";
import useOrders from "@/app/_hooks/useOrders";

function CustomerOrdersAndBillsPage() {
  const id = useParams().customer as string;
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { getOrdersByCustomer, ordersOfCustomer } = useOrders();

  useEffect(() => {
    getOrdersByCustomer(id);
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
      ?.reduce((sum, order) => sum + parseFloat(order.price), 0)
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

  const renderOrdersTable = (orders: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:block">Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order._id}>
            <TableCell className="hidden sm:block">{order._id}</TableCell>
            <TableCell>{format(order.date, "yyyy-MM-dd")}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{order.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="mx-auto">
      <h1 className="ml-3 md:ml-0 text-xl sm:text-2xl font-bold mb-6 text-wrap">
        Orders and Bills #{id}
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Summary</CardTitle>
          <CardDescription>
            View your order history and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateTotalBill(orders)}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <CardTitle className="text-xl">Order History</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent>{renderOrdersTable(orders)}</CardContent>
      </Card>
    </div>
  );
}

export default CustomerOrdersAndBillsPage;
