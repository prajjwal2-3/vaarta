"use client";

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

import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signInSchema } from "@/lib/zod";
import LoadingButton from "@/components/loading-button";
import {
  handleCredentialsSignin,
  handleGoogleSignin,
} from "@/actions/authActions";
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const params = useSearchParams();
  const error = params.get("error");
  const router = useRouter();

  const [globalError, setGlobalError] = useState<string>("");

  useEffect(() => {
    if (error) {
      switch (error) {
        case "OAuthAccountNotLinked":
          setGlobalError("Please use your email and password to sign in.");
          break;
        default:
          setGlobalError("An unexpected error occurred. Please try again.");
      }
    }
    router.replace("/auth/signin");
  }, [error, router]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialsSignin(values);
      if (result?.message) {
        setGlobalError(result.message);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen relative flex items-center overflow-clip justify-center lg:justify-between p-20 gap-20">
      <div className="absolute w-[425px] h-[425px] bg-[#DCFF00] blur-[675px] top-[1100px] -left-[200px]"></div>
      <div className="absolute w-[425px] h-[725px] -top-[22px] blur-[675px] bg-[#846EE9] left-[1500px]"></div>
      <div className="blur-[675px] bg-[#846EE9] w-[425px] h-[425px] -top-[250px] -left-[290px] absolute"></div>
      <Card className="w-full mx-auto max-w-[529px]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-black">
            Sign in
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          {globalError && <ErrorMessage error={globalError} />}
          <form className="w-full" action={handleGoogleSignin}>
            <Button
              variant="outline"
              className="w-full  rounded-lg"
              type="submit"
            >
              <FcGoogle className="h-4 w-4 mr-2" />
             Continue with Google
            </Button>
          </form>
          <div className="flex items-center justify-center">
            <span className="w-full border-t dark:border-gray-600"></span>
            <span className="px-3 text-gray-500 dark:text-gray-400">Or</span>
            <span className="w-full border-t dark:border-gray-600"></span>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <Label className="ml-auto w-fit">Forget Password?</Label>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={form.formState.isSubmitting}>
                Continue
              </LoadingButton>
            </form>
          </Form>

          <div className="pt-4 items-center text-[#8D8A94] flex flex-col lg:flex-row justify-center ">
            New user?
            <Link
              href={"/auth/signup"}
              className="text-black ml-2 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
