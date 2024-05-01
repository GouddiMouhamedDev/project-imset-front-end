"use client"


import { VehiclesForm } from "@/components/vehiclesForm"



export default function AddVehicle(){
  

  return (
   
      <div className="lg:p-8 relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Add
            </h1>
          </div>
          <VehiclesForm/>
        </div>
      </div>
     
  )
}
