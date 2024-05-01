import { Metadata } from "next"
import { UserForm } from "@/components/userForm"
import { GrLogin } from "react-icons/gr"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Register",
  description: "Register forms built using the components.",
}

export default function Register() {
  return (
    
      <div className="lg:p-8 relative">
        <Link
          href="/login"
          className="absolute top-4 right-4 flex items-center p-2 space-x-3 rounded-md"
        >
          <GrLogin />
          <span>Login</span>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Register
            </h1>
          </div>
          <UserForm  customRoute="/login"/>
        </div>
      </div>
    
  )
}
