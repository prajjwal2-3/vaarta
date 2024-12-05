import React from 'react'
import SignIn from '@/components/auth/signinCom'
import { Suspense } from 'react'
export default function page() {
  return (
   <Suspense>
    <SignIn/>
   </Suspense>
  )
}
