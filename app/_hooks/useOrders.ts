import useCustomers from "@/app/_hooks/useCustomer";
import { orderSchema } from "@/app/_components/formSchema";
import { CustomersType, OrdersType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleAxiosError } from "@/utils";

type YourFormType = Partial<z.infer<typeof orderSchema>>;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const useOrders = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDelOpen, setIsDelOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [ordersOfCustomer, setOrdersOfCustomer] = useState<OrdersType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [defaultValues, setDefaultValues] = useState<YourFormType | null>(null);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);

  const { users: allCustomers } = useCustomers();

  // register form
  const registerForm = useForm<YourFormType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      searchTerm: "",
      customer: "",
      quantity: 0,
      price: 0,
    },
  });

  const searchTerm = registerForm.watch("searchTerm");

  // register handler
  const registerHandler = async (values: YourFormType) => {
    try {
      const response = await axios.post(
        `${baseUrl}/orders/register`,
        { ...values, date: format(new Date(selectedDate), "yyyy-MM-dd") },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const customer = await axios.put(
        `${baseUrl}/customers/${response.data.data.customer}`,
        {
          order: response.data.data._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!customer.data.success) {
        throw new Error(customer.data.message);
      }

      console.log("Order Created Successfully");

      registerForm.reset();

      setIsOpen(false);

      // users state update after creating user
      getOrders();
    } catch (err) {
      const handledError = handleAxiosError(err);

      registerForm.setError("customer", {
        type: "custom",
        message: handledError.message,
      });

      console.error("Error:", handledError.message || "An error occurred.");
    }
  };

  // get all orders
  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/orders`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setOrders(response.data.data || []);
      setTotalOrdersCount(response.data.data.length || 0);
    } catch (err) {
      const handledError = handleAxiosError(err);

      console.error("Error:", handledError.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByCustomer = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/orders/customer/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setOrdersOfCustomer(response.data.data || []);
    } catch (err) {
      const handledError = handleAxiosError(err);

      console.error("Error:", handledError.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // update order handler
  const updateOrderHandler = async (values: YourFormType) => {
    try {
      const response = await axios.put(`${baseUrl}/orders/${orderId}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      console.log(response.data.message || "User Updated Successfully");

      setIsOpen(false);
      setOrderId(null);
      setIsEditing(false);

      registerForm.reset({
        quantity: 0,
        price: 0,
        customer: "",
      });

      // users state update after updating user
      getOrders();
    } catch (err) {
      const handledError = handleAxiosError(err);

      console.error("Error:", handledError.message || "An error occurred.");
    }
  };

  // delete order handler
  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/orders/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      console.log("Order Deleted Successfully");
      setOrderId(null);
      getOrders();
    } catch (err) {
      const handledError = handleAxiosError(err);

      console.error("Error:", handledError.message || "An error occurred.");
    }
  };

  // handle previous day
  const handlePreviousDay = useCallback(
    () => setSelectedDate((prev) => subDays(prev, 1)),
    []
  );

  // handle next day
  const handleNextDay = useCallback(
    () => setSelectedDate((prev) => addDays(prev, 1)),
    []
  );

  // Memoize filteredOrders
  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          format(order.date, "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      ),
    [orders, selectedDate]
  );

  // Memoize customers who have not placed orders
  const customers = useMemo(() => {
    // Collect customer IDs from filteredOrders
    const customersWithOrders = new Set(
      filteredOrders.map((order) => order.customer)
    );

    // Filter all customers to exclude those who have placed orders
    return allCustomers.filter(
      (customer: CustomersType) =>
        !customersWithOrders.has(customer._id) && // Exclude customers with orders
        (!searchTerm || // If no searchTerm, skip this condition
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [filteredOrders, searchTerm, allCustomers]);

  // Memoize totalOrders
  const totalOrders = useMemo(() => filteredOrders.length, [filteredOrders]);

  // Memoize totalQuantity
  const totalQuantity = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.quantity, 0),
    [filteredOrders]
  );

  // Memoize totalPrice
  const totalPrice = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + (order.price || 0), 0),
    [filteredOrders]
  );

  //  Memoize monthlyOrders
  const monthlyOrders = useMemo(() => {
    const monthStart = startOfMonth(new Date());

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        isAfter(orderDate, monthStart) || isSameDay(orderDate, monthStart) // 'isSameDay' ব্যবহার করে আরও নির্ভুলভাবে যাচাই করা
      );
    }).length;
  }, [orders]);

  // Memoize weeklyOrders
  const weeklyOrders = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 6 }); // শনিবার শুরু করলে weekStartsOn: 6

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return isAfter(orderDate, weekStart) || isSameDay(orderDate, weekStart);
    }).length;
  }, [orders]);

  // Memoize previousYearOrders
  const previousYearOrders = useMemo(() => {
    const startOfLastYear = startOfYear(subYears(new Date(), 1)); // আগের বছরের শুরু
    const endOfLastYear = endOfYear(subYears(new Date(), 1)); // আগের বছরের শেষ

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= startOfLastYear && orderDate <= endOfLastYear;
    }).length;
  }, [orders]);

  // Memoize thisYearOrders
  const thisYearOrders = useMemo(() => {
    const startOfThisYear = startOfYear(new Date()); // চলতি বছরের শুরু
    const endOfThisYear = endOfYear(new Date()); // চলতি বছরের শেষ

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= startOfThisYear && orderDate <= endOfThisYear;
    }).length;
  }, [orders]);

  // Memoize previousDayOrders
  const previousDayOrders = useMemo(() => {
    const yesterday = subDays(selectedDate || new Date(), 1); // selectedDate না থাকলে current date ধরে

    return orders.filter((order) => isSameDay(new Date(order.date), yesterday))
      .length;
  }, [orders, selectedDate]);

  // Memoize previousWeekOrders
  const previousWeekOrders = useMemo(() => {
    const weekStart = startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 });

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return isAfter(orderDate, weekStart) || isSameDay(orderDate, weekStart);
    }).length;
  }, [orders]);

  // Memoize previousMonthOrders
  const previousMonthOrders = useMemo(() => {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        (isAfter(orderDate, lastMonthStart) ||
          isSameDay(orderDate, lastMonthStart)) &&
        (isBefore(orderDate, lastMonthEnd) ||
          isSameDay(orderDate, lastMonthEnd))
      );
    }).length;
  }, [orders]);

  useEffect(() => {
    getOrders();
  }, []);

  return {
    totalQuantity,
    totalPrice,
    orders,
    filteredOrders,
    totalOrders,
    totalOrdersCount,

    customers,

    weeklyOrders,
    monthlyOrders,
    thisYearOrders,
    previousYearOrders,
    previousMonthOrders,
    previousWeekOrders,
    previousDayOrders,

    registerHandler,
    deleteHandler,
    handleNextDay,
    handlePreviousDay,

    ordersOfCustomer,
    getOrdersByCustomer,

    isOpen,
    setIsOpen,

    selectedDate,
    setSelectedDate,

    isDelOpen,
    setIsDelOpen,

    isEditing,
    setIsEditing,

    orderId,
    setOrderId,

    defaultValues,
    setDefaultValues,

    searchTerm,
    loading,

    updateOrderHandler,
    registerForm,
  };
};

export default useOrders;
