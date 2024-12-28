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
  // const [singleUser, setSingleUser] = useState<CustomersType | null>(null);
  const [defaultValues, setDefaultValues] = useState<YourFormType | null>(null);

  // register form
  const registerForm = useForm<YourFormType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      secondaryPhone: "",
      address: "",
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

  // get single user
  // const getUserById = async (id: string) => {
  //   if (!id) return;
  //   setLoading(true);

  //   try {
  //     const response = await axios.get(
  //  seUrl}/customers/${id},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.data.success) {
  //       throw new Error(response.data.message);
  //     }

  //

  //     setSingleUser(response.data.data);
  //   } catch (err) {
  //     const handledError = handleAxiosError(err);

  //
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

    loading,
    users,
  };
};

export default useCustomers;
