"use client";

import { ModeToggle } from "./modeToggle";
import Image from "next/image";
import { Card } from "./ui/card";

export default function Header() {
  return (
    <header className="flex justify-center">
      <div className="mx-5 w-full">
        <Card className="flex items-center justify-between p-5">
         
            <div></div>
              <Image src="/img/logo1.png" width={250} height={100} alt="Logo" />
            
         
          <div>
            <ModeToggle />
          </div>
        </Card>
      </div>
    </header>
  );
}
