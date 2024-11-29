"use client";
import { ReactNode } from "react";
import {  QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
interface Props {
  children: ReactNode;
}

export default function QueryProvider({ children }: Props) {

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}