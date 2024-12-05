"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import { handleCredentialsSignin, handleSignUp } from "@/actions/authActions";




export default function SignUp() {
    const [globalError, setGlobalError] = useState("");

    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });
  
    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
      try {
        const result: ServerActionResponse = await handleSignUp(values);
        if (result.success) {
          console.log("Account created successfully.");
          const valuesForSignin = {
            email: values.email,
            password: values.password,
          };
          await handleCredentialsSignin(valuesForSignin);
        } else {
          setGlobalError(result.message);
        }
      } catch (error) {
        setGlobalError("An unexpected error occurred. Please try again.");
        console.log(error)
      }
    };
  return (
    <div className="h-screen relative flex items-center  overflow-clip justify-center lg:justify-between p-5 lg:p-20 gap-20">
      <div className="absolute w-[425px] h-[425px] bg-[#DCFF00] blur-[675px] top-[1100px] -left-[200px]"></div>
      <div className="absolute w-[425px] h-[725px] -top-[22px] blur-[675px] bg-[#846EE9] left-[1500px]"></div>
      <div className="blur-[675px] bg-[#846EE9] w-[425px] h-[425px] -top-[250px] -left-[290px] absolute"></div>
      
      <Card className="w-full mx-auto max-w-[529px]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-white">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                              ? "email"
                              : "text"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={form.formState.isSubmitting}>
                Continue
              </LoadingButton>
            </form>
          </Form>
          <div className="pt-4 items-center text-[#8D8A94] flex flex-col lg:flex-row justify-center ">
            Already have an account?
            <Link
              href={"/auth/signin"}
              className="text-white ml-2 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
