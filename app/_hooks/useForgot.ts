import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, resetPasswordSchema } from "@/app/_components/formSchema";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { handleAxiosError } from "@/utils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const useForgot = () => {
  const [isPending, setIsPending] = useState(false);
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const forgotForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      token: "",
    },
  });

  const forgotPassword = async (email: { email: string }) => {
    setIsPending(true);
    try {
      const response = await axios.post(
        `${baseUrl}/users/forgot-password`,
        email
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      forgotForm.reset();

      return response.data;
    } catch (err) {
      const handledError = handleAxiosError(err);

      console.error("Error:", handledError.message || "An error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const resetPassword = async (data: { password: string }) => {
    setIsPending(true);
    try {
      const response = await axios.post(
        `${baseUrl}/users/reset-password/${token}`,
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      resetForm.reset();

      router.push("/auth/users/log-in");

      return response.data;
    } catch (err) {
      const handledError = handleAxiosError(err);

      resetForm.setError("password", {
        type: "custom",
        message: "Invalid token",
      });

      console.error("Error:", handledError.message || "An error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, forgotPassword, resetPassword, forgotForm, resetForm };
};

export default useForgot;
