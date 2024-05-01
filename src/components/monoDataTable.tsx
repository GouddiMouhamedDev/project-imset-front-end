import React from 'react';
import { Table, TableCaption, TableCell, TableRow,TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EditIcon from './editIcone';
import Link from 'next/link';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader,AlertDialogTitle, AlertDialogTrigger,} from "@/components/ui/alert-dialog";

export default function MonoDataTable({ data,tabeCaptionMsg,link,handleDelete}: any) {
    if (typeof data !== 'object') {
        return null; // Retourne null si les données ne sont pas valides
    }

    const columnHeaders = Object.keys(data);

    return (
        <Table>
            <TableCaption>
                <div className='flex justify-center space-x-6 pb-4' > <Link href={link}> <EditIcon/> </Link>  

                 <AlertDialog>
      <AlertDialogTrigger asChild>
       <div style={{ cursor: 'pointer' }} onMouseEnter={(e:any) => e.currentTarget.style.color = 'blue'}
         onMouseLeave={(e:any) => e.currentTarget.style.color = 'currentColor'}>
 <RiDeleteBin6Line   /> 
       </div>
       
     
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
          Cette action ne peut pas être annulée. Cela supprimera définitivement  vos données de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} >Continuer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
                 </AlertDialog> 
                </div>
                
                 
                
                 {tabeCaptionMsg}
                 </TableCaption>
                 <TableBody>
            {columnHeaders.map((header) => (
                <TableRow key={header}>
                    <TableCell>{header}</TableCell>
                    <TableCell>
                        {data[header] === null ? (
                            <Badge className="bg-yellow-600" variant="default"
                            
                            >Null</Badge>
                        ) : typeof data[header] === 'boolean' ? (
                            data[header] ? (
                                <Badge className="bg-green-600" variant="default">Active</Badge>
                            ) : (
                                <Badge className="bg-red-600" variant="default">Inactive</Badge>
                            )
                        ) : (
                            data[header]
                        )}
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    );
}
