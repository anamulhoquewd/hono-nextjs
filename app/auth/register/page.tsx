"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUsers from "@/app/_hooks/useUsers";
import { UserRegisterForms } from "@/app/_components/forms/registerForm";

const RegisterUsers = () => {
  const { registerHandler, registerForm } = useUsers();

  return (
    <Card className="w-full max-w-2xl mx-auto my-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Welcome back to the app!
        </CardTitle>
        <CardDescription>
          Enter your details to register for our catering service system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserRegisterForms onSubmit={registerHandler} form={registerForm} />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/log-in"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterUsers;
