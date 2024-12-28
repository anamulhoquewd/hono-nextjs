import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Users,
} from "lucide-react";
import useUsers from "@/app/_hooks/useUsers";
import useCustomers from "@/app/_hooks/useCustomer";
import useOrders from "@/app/_hooks/useOrders";
import { format } from "date-fns";

function Information() {
  const {
    totalOrdersCount,
    totalOrders,
    handlePreviousDay,
    handleNextDay,
    selectedDate,
    setSelectedDate,
    monthlyOrders,
    weeklyOrders,
    previousMonthOrders,
    previousDayOrders,
    previousWeekOrders,
    thisYearOrders,
    previousYearOrders,
  } = useOrders();

  const { managers, deliveryMans } = useUsers();

  const { users: customers } = useCustomers();

  return (
    <div className="mx-auto mt-6 w-full grid gap-4 lg:grid-cols-2 md:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex text-sm font-medium items-center justify-between w-full sm:w-auto sm:gap-4">
            <Button onClick={handlePreviousDay} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 sm:w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 hidden sm:block h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={(date) => date && setSelectedDate(date)}
                  selected={selectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleNextDay} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Package className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </CardHeader>

        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground mb-4">
            {Math.floor(
              ((totalOrders - previousDayOrders) / totalOrders) * 100
            )}
            % from last day
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                This Week
              </span>
              <span className="text-xl sm:text-2xl font-bold">
                {weeklyOrders}
              </span>
              <p className="text-xs text-muted-foreground">
                {Math.floor(
                  (weeklyOrders - previousWeekOrders) / weeklyOrders
                ) * 100}
                % from last week
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                This Month
              </span>
              <span className="text-xl sm:text-2xl font-bold">
                {monthlyOrders}
              </span>
              <p className="text-xs text-muted-foreground">
                {Math.floor(
                  ((monthlyOrders - previousMonthOrders) / monthlyOrders) * 100
                )}
                % from last month
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Previous Month
              </span>
              <span className="text-xl sm:text-2xl font-bold">
                {previousMonthOrders}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                This Year
              </span>
              <span className="text-xl sm:text-2xl font-bold">
                {thisYearOrders}
              </span>
              <p className="text-xs text-muted-foreground">
                {Math.floor(
                  ((thisYearOrders - previousYearOrders) / thisYearOrders) * 100
                )}
                % from last year
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders successful
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {totalOrdersCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Orders closed successfully
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {customers.length}
            </div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {managers.length}
            </div>
            <p className="text-xs text-muted-foreground">Active managers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Mans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {deliveryMans.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active delivery mans
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Information;
