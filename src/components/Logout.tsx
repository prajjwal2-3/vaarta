import { auth } from "@/auth";
import React from 'react'
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { handleSignOut } from "@/actions/authActions";
export default async function LogoutButton() {
  const session = await auth();
  return (
    <div className="mx-auto">
            
            {!session ? (
                <div className="flex gap-2 justify-center">
                    <Link href="/auth/signin">
                        <Button variant="default">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button variant="default">Sign Up</Button>
                    </Link>
                </div>
            ) : (
                <form action={handleSignOut}>
                    <Button variant="default" type="submit" className="w-full">
                        <LogOut/>
                        <p className="hidden md:block">Sign Out</p>
                    </Button>
                </form>
            )}
        </div>
  )
}
