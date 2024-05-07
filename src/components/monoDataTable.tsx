import React from "react";
import {
  Table,
  TableCaption,
  TableCell,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EditIcon from "./editIcone";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"

import { getUserInfoFromStorage } from "@/api/auth";

export default function MonoDataTable({ data, link, handleDelete }: any) {
  const userRole = getUserInfoFromStorage()?.role;
  
  
  if (typeof data !== "object") {
    return null; // Retourne null si les données ne sont pas valides
  }

  const columnHeaders = Object.keys(data);
  return (
    <div className="flex-col items-center  space-x-4 space-y-8">
      <Table>
        <TableCaption></TableCaption>
        <TableBody>
          {columnHeaders.map((header) => (
            <TableRow key={header}>
              <TableCell>{header}</TableCell>
              <TableCell>
                {data[header] === null ? (
                  <Badge className="bg-yellow-600" variant="default">
                    Null
                  </Badge>
                ) : typeof data[header] === "boolean" ? (
                  data[header] ? (
                    <Badge className="bg-green-600" variant="default">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-600" variant="default">
                      Inactive
                    </Badge>
                  )
                ) : (
                  data[header]
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex  justify-center  space-x-4 ">
        <Link href={link}>
          <Button>Modifier</Button>
        </Link>
       
      </div>
    </div>
  );
}
