import { customerSchema } from "@/app/_components/formSchema";
import { handleAxiosError } from "@/utils";
import { CustomersType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type YourFormType = Partial<z.infer<typeof customerSchema>>;

const useCustomers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDelOpen, setIsDelOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<CustomersType[]>([]);
  const [defaultValues, setDefaultValues] = useState<YourFormType | null>(null);

  // register form
  const registerForm = useForm<YourFormType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      secondaryPhone: "",
      address: "",
      defaultPrice: 0,
      defaultQuantity: 1,
      role: "customer",
    },
  });

  // register handler
  const registerHandler = async (values: YourFormType) => {
    try {
      const response = await axios.post(
        `${baseUrl}/customers/register`,
        values,
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

      registerForm.reset();

      setIsOpen(false);

      // users state update after creating user
      getUsers();
    } catch (err) {
      const handledError = handleAxiosError(err);

      registerForm.setError("phone", {
        type: "custom",
        message: handledError.message,
      });
    }
  };

  // get all users
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/customers`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setUsers(response.data.data || []);
    } catch (err) {
      const handledError = handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // get single user
  const getUserById = async (id: string) => {
    if (!id) return;
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/customers/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (err) {
      const handledError = handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // update user handler
  const updateUserHandler = async (values: YourFormType) => {
    try {
      const response = await axios.put(
        `${baseUrl}/customers/${userId}`,
        values,
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

      setIsOpen(false);
      setIsEditing(false);

      // users state update after updating user
      getUsers();
    } catch (err) {
      const handledError = handleAxiosError(err);
    }
  };

  // delete user handler
  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/customers/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setUserId(null);
      setDefaultValues(null);
      getUsers();
    } catch (err) {
      const handledError = handleAxiosError(err);
      console.log("Error :", handledError);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return {
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
    getUserById,

    loading,
    users,
  };
};

export default useCustomers;
