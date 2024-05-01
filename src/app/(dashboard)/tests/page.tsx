"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FiUsers } from "react-icons/fi";
import {  IoMdAddCircleOutline } from "react-icons/io";
import Link from "next/link";                       
import { FaListOl } from "react-icons/fa";
import { getUserRoleFromStorage } from "@/api/auth";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuSettings } from "react-icons/lu";
import { GrLogout } from "react-icons/gr";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdCommute, MdLockReset } from "react-icons/md";

export default function AccordionDemo() {
  const userRole = getUserRoleFromStorage();
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  return (
    <div className="hidden md:flex flex-col p-3 bg-white shadow w-40 h-screen ">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">Sidebar</h2>
      </div>
      <br />
      <div className="space-y-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2  hover:underline"
            >
              <AiOutlineDashboard />
              <span>Dashboard</span>
            </Link>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FiUsers />
                <span>User</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/users"
                className="flex items-center p-2 space-x-2 rounded-md"
              >
                <FaListOl />
                &nbsp;List
              </Link>
              {isAdmin && ( // Vérifiez si l'utilisateur a le rôle 'super-admin'
                <>
                  <Link
                    href="/users/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline />
                    &nbsp;Add
                  </Link>
                  <Link
                    href="/users/delete"
                    className="flex items-center p-2 space-x-2 rounded-md"
                  >
                    <RiDeleteBin6Line />
                    &nbsp;Del
                  </Link>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <MdCommute />
                <span>Vehicules</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/vehicles"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;List
              </Link>
              {isAdmin && ( // Vérifiez si l'utilisateur a le rôle 'super-admin'
                <>
                  <Link
                    href="/vehicles/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline />
                    &nbsp;Add
                  </Link>
                  <Link
                    href="/vehicles/delete"
                    className="flex items-center p-2 space-x-2 rounded-md"
                  >
                    <RiDeleteBin6Line />
                    &nbsp;Del
                  </Link>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
            <div className="flex items-center space-x-2">
            <LuSettings />
              <span>Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/reset"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <MdLockReset />
                &nbsp;Rst
              </Link>
            </AccordionContent>
          </AccordionItem>
          <Link
            href="/login"
            className="flex items-center space-x-2">
            <GrLogout />
            <span>Logout</span>
          </Link>
        </Accordion>
       
      </div>
    </div>
  );
}
