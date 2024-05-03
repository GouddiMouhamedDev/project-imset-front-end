"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";



export default function     MultiDataTable({ data,To}: any ) {
    const columnHeaders = Object.keys(data && data.length > 0 ? data[0] : {});

   
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columnHeaders.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                    
                </TableRow>
            </TableHeader>
            <TableBody>
                {data && data.length > 0 ? (
                    data.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                            {columnHeaders.map((header, columnIndex) => (
                                <TableCell key={columnIndex}>
                                     <Link href={`/${To}/${row._id}`}>
                                            {row[header] === null ? (
                                                <Badge className="">Null</Badge>
                                            ) : typeof row[header] === 'boolean' ? (
                                                <Badge className={`bg-${row[header] ? 'green' : 'red'}-600 hover`} variant="default">
                                                    {row[header] ? 'Active' : 'Inactive'}
                                                </Badge>
                                            ) : (
                                                <span>{row[header]}</span>
                                            )}
                                      
                                    </Link>
                                </TableCell>
                            ))}
                         
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columnHeaders.length + 1}>Aucune donnée disponible</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
