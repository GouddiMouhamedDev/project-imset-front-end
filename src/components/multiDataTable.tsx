"use client";
import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from './ui/button';
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function MultiDataTable({ data, To }: any) {

    const columnHeaders = Object.keys(data && data.length > 0 ? data[0] : {});

    return (
        <div className="rounded-md border mt-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* Bouclez sur les en-têtes de colonne */}
                        {columnHeaders.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && data.length > 0 ? (
                        data.map((row: any, rowIndex: number) => (
                            <TableRow key={rowIndex}>
                                {/* Bouclez sur les données de la ligne */}
                                {columnHeaders.map((header, columnIndex) => (
                                    <TableCell key={columnIndex}>
                                        <Link href={`/${To}/${row.Id}`}>
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
                                {/* Cellule pour le bouton */}
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Edit Profile</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit profile</DialogTitle>
                                                <DialogDescription>
                                                   
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        defaultValue="Pedro Duarte"
                                                        className="col-span-3"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="username" className="text-right">
                                                        Username
                                                    </Label>
                                                    <Input
                                                        id="username"
                                                        defaultValue="@peduarte"
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columnHeaders.length}>Aucune donnée disponible</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

}