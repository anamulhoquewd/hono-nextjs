"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserLoginForms } from "@/app/_components/forms/loginForm";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleAxiosError } from "@/utils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function LoginPage() {
  const router = useRouter();

  // login form
  const loginForm = useForm<{ email: string; password: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().email({
          message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
          message: "Password must be at least 8 characters.",
        }),
      })
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // login handler
  const loginHandler = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${baseUrl}/users/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.push("/");

      loginForm.reset();
    } catch (err) {
      const handledError = handleAxiosError(err);

      loginForm.setError("email", {
        type: "custom",
        message: handledError.message,
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Log In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserLoginForms form={loginForm} onSubmit={loginHandler} />
        </CardContent>
      </Card>
    </div>
  );
}
