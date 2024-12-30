import { changePassSchema, userSchema } from "@/app/_components/formSchema";
import { handleAxiosError } from "@/utils";
import { UsersType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type YourFormType = Partial<z.infer<typeof userSchema>>;

type ChangePassFormType = z.infer<typeof changePassSchema>;

const useUsers = (role?: "admin" | "manager" | "delivery_man") => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState<boolean>(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);
  const [isDelOpen, setIsDelOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [admins, setAdmins] = useState<UsersType[]>([]);
  const [managers, setManagers] = useState<UsersType[]>([]);
  const [deliveryMans, setDeliveryMans] = useState<UsersType[]>([]);
  const [profile, setProfile] = useState<UsersType | null>(null);
  const [defaultValues, setDefaultValues] = useState<YourFormType | null>(null);

  const router = useRouter();

  // register form
  const registerForm = useForm<YourFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      NID: "",
      address: "",
      role: role || "admin",
    },
  });

  // password change form
  const changePassForm = useForm<ChangePassFormType>({
    resolver: zodResolver(changePassSchema),
    defaultValues: {
      prevPassword: "",
      newPassword: "",
    },
  });

  // logout handler
  const logoutHandler = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/users/logout`,
        {},
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

      router.push("/");
    } catch (err) {
      const handledError = handleAxiosError(err);
    }
  };

  // register handler
  const registerHandler = async (values: YourFormType) => {
    try {
      const response = await axios.post(`${baseUrl}/users/register`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      registerForm.reset();

      setIsOpen(false);

      // users state update after creating user
      getUsers();
    } catch (err) {
      const handledError = handleAxiosError(err);

      registerForm.setError("email", {
        type: "custom",
        message: handledError.message,
      });
    }
  };

  // get user on your profile
  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/users/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setProfile(response.data.data);
    } catch (err) {
      const handledError = handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // get all users
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await axios.put(`${baseUrl}/users`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setProfile(response.data.data);
      setIsOpen(false);
      setIsEditing(false);
    } catch (err) {
      const handledError = handleAxiosError(err);

      registerForm.setError("email", {
        type: "custom",
        message: "Email or Number already exists",
      });
    }
  };

  // upload avatar handler
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) {
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await axios.post(
        `${baseUrl}/users/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsAvatarOpen(false);

      updateUserHandler({ avatar: response.data.url });
    } catch (err) {
      const handledError = handleAxiosError(err);
    }
  };

  // change password handler
  const changePassHandler = async (values: ChangePassFormType) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/users/change-password`,
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

      changePassForm.reset();
      setIsChangePassOpen(false);
    } catch (err) {
      const handledError = handleAxiosError(err);

      changePassForm.setError("prevPassword", {
        type: "custom",
        message: handledError.message,
      });
    }
  };

  // delete user handler
  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setUserId(null);
      getUsers();
    } catch (err) {
      const handledError = handleAxiosError(err);
    }
  };

  // filter users by role as admin
  const getAdmins = (users: UsersType[]) => {
    const admins = users.filter((user) => user.role === "admin");
    setAdmins(admins);
    return admins;
  };

  // filter users by role as manager
  const getManagers = (users: UsersType[]) => {
    const managers = users.filter((user) => user.role === "manager");
    setManagers(managers);
    return managers;
  };

  // filter users by role as delivery man
  const getDeliveryMans = (users: UsersType[]) => {
    const deliveryMans = users.filter((user) => user.role === "delivery_man");
    setDeliveryMans(deliveryMans);
    return deliveryMans;
  };

  useEffect(() => {
    getUsers();
    getProfile();
  }, []);

  useEffect(() => {
    getAdmins(users);
    getManagers(users);
    getDeliveryMans(users);
  }, [users]);

  return {
    uploadAvatar,
    registerHandler,
    changePassHandler,
    deleteHandler,
    updateUserHandler,
    logoutHandler,

    registerForm,
    changePassForm,

    loading,

    users,
    admins,
    managers,
    deliveryMans,
    profile,

    isOpen,
    setIsOpen,

    isDelOpen,
    setIsDelOpen,

    isAvatarOpen,
    setIsAvatarOpen,

    isEditing,
    setIsEditing,

    defaultValues,
    setDefaultValues,

    setUserId,

    isChangePassOpen,
    setIsChangePassOpen,
  };
};

export default useUsers;
