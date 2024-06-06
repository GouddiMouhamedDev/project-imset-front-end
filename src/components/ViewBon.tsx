"use client";

import React, {useRef } from 'react';
import '@/app/ViewBon.css'; // Import du CSS directement
import { Button } from './ui/button';
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { GiReturnArrow } from 'react-icons/gi';
import { NumberToLetter } from 'convertir-nombre-lettre';
interface Product {
  designation: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

interface BonLivraisonProps {
  clientCode: string;
  clientName: string;
  clientPhone: string;
  clientMat: string;
  clientAddress: string;
  deliveryNoteNumber: string;
  creationDate: string;
  products: Product[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  vendor: string;
  vehicle?: string;
  chauffeur?: string;
  societeName: string;
  societeActivity: string;
  societeAdresse: string;
  sociteGsm: string;
  societeTel: string;
  societeRc: string;
  societeMf: string;
  bonType: string;
}

export default function ViewBon({
  clientCode,
  clientName,
  clientPhone,
  clientMat,
  clientAddress,
  deliveryNoteNumber,
  creationDate,
  products,
  totalHT,
  totalTVA,
  totalTTC,
  vendor,
  vehicle,
  chauffeur,
  societeName,
  societeActivity,
  societeAdresse,
  sociteGsm,
  societeTel,
  societeRc,
  societeMf,
  bonType,
}: BonLivraisonProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handlePrint = () => {
    if (divRef.current) {
      divRef.current.style.display = "none";
    }
    window.print();
    if (divRef.current) {
      divRef.current.style.display = "block";
    }
  };
  
  function convertTotalToWords(totalTTC: number): string {
    const integerPart = Math.floor(totalTTC);
    const decimalPart = Math.round((totalTTC - integerPart) * 1000);
    
    let totalInWords = '';

    if (integerPart === 1) {
        totalInWords += 'un dinar';
    } else if (integerPart > 1) {
        totalInWords += `${NumberToLetter(integerPart)} dinars`;
    }

    if (decimalPart > 0) {
        const millimesInWords = NumberToLetter(decimalPart);
        if (integerPart > 0) {
            totalInWords += ' et ';
        }
        totalInWords += `${millimesInWords} millimes`;
    }

    return totalInWords.trim();
}





  
  
  


  

  

  return (  
    <>
      <div className='flex flex-col items-center space-y-2'>
        <div ref={divRef} className="space-x-2">
          <Button onClick={handlePrint}>
            <MdOutlineLocalPrintshop />
          </Button>
          <Button onClick={handleBack}>
            <GiReturnArrow />
          </Button>
        </div>
        <div id="bon" className="bon p-4 max-w-2xl mx-auto bg-white text-black text-sm">
          <div className="flex justify-between">
            <div className="text-center text-sm">
              <p><strong>{societeName}</strong></p>
              <p>{societeActivity}</p>
              <p>RC : {societeRc}  MF : {societeMf}</p>
              <p>{societeAdresse}</p>
              <p>GSM : {sociteGsm}  Tél : {societeTel}</p>
            </div>
            <div className="flex justify-between mb-4 border border-dashed">
              <table className="m-2">
                <tbody>
                  <tr>
                    <td>Code Client:</td>
                    <td>{clientCode}</td>
                  </tr>
                  <tr>
                    <td>Nom:</td>
                    <td>{clientName}</td>
                  </tr>
                  <tr>
                    <td>Téléphone:</td>
                    <td>{clientPhone}</td>
                  </tr>
                  <tr>
                    <td>Matricule/Cin:</td>
                    <td>{clientMat}</td>
                  </tr>
                  <tr>
                    <td>Adresse:</td>
                    <td>{clientAddress}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p>Date: {creationDate}</p>
            </div>
            <div className="pb-1">
              <p>{bonType} N°: {deliveryNoteNumber}</p>
            </div>
          </div>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2">Désignation</th>
                <th className="border p-2">Qté</th>
                <th className="border p-2">PU HT</th>
                <th className="border p-2">Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="p-1 text-center border-x">{product.designation}</td>
                  <td className="p-1 text-center border-x">{product.qty}</td>
                  <td className="p-1 text-center border-x">{product.unitPrice.toFixed(3)}</td>
                  <td className="p-1 text-center border-x">{product.totalPrice.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between pt-2">
            <div>
              <p>Vendeur: {vendor}</p>
              {vehicle && <p>Véhicule: {vehicle}</p>}
              {chauffeur && <p>Chauffeur: {chauffeur}</p>}
            </div>
            <div>
              <p>Signature</p>
              <p>       <strong>.</strong></p>
            </div>
            <div className="pl-5 border p-2">
              <p>Total HT: {totalHT.toFixed(3)}</p>
              <p>Total TVA: {totalTVA.toFixed(3)}</p>
              <p><strong>Total TTC: {totalTTC.toFixed(3)}</strong></p>
            </div>
          </div>
          <p>
            Arrêté le présent bon de livraison à la somme de :
          </p>
          <p>
            {convertTotalToWords(totalTTC)}
          </p>
        </div>
      </div>
    </>
  );
}
