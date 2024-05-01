
import { UserLoginForm } from "@/components/userLoginForm"



export default function Login() {
  return (
    <>
      <div className="lg:p-8 relative">
       
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] sm:h-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password
            </p>
          </div>
          <UserLoginForm />
        </div>
      </div>
    </>
  )
}
