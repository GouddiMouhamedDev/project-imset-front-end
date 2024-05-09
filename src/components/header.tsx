"use client"
import React, { useState, useCallback } from "react";
import MediaPlayer from "@/components/MediaPlayer/MediaPlayer";
import { ModeToggle } from "./modeToggle";
import { Card } from "./ui/card";

export default function Header() {
  const [selectedChannelIndex, setSelectedChannelIndex] = useState<number>(0);

  const data = [
    {
      "id": "772df529-de8d-462d-88c1-e00ef66ff2b5",
      "url": "https://s42.myradiostream.com/29400/listen.mp3",
      "cover": "https://media.info/l/f/7/7459.1623551191.png",
      "title": "Thornbury",
      "program": "Best of the week"
    },
    {
      "id": "93747643-930b-4b44-9465-2c7714fbf352",
      "url": "http://uplink.duplexfx.com:8062",
      "cover": "https://www.radio.es/images/broadcasts/07/d6/105208/1/c300.png",
      "title": "108.fm",
      "program": "The Beatles Channel"
    },
    {
      "id": "565c82bf-4981-4490-8074-bc5553f3abac",
      "url": "http://sc-disco.1.fm:8100",
      "cover": "https://www.radio.es/images/broadcasts/e5/6b/1373/2/c300.png",
      "title": "Disco Ball",
      "program": "Best of Disco Ball 70's-80's"
    },
    {
      "id": "mosaique-id",
      "url": "https://radio.mosaiquefm.net/mosalive",
      "cover": "http://mosaique-url.com/cover.jpg",
      "title": "Mosaique",
      "program": "Mosaique Program"
    }
  ];

  const handleChangeChannel = useCallback((forward: boolean) => {
    setSelectedChannelIndex((prevIndex) =>
      forward
        ? prevIndex < data.length - 1 ? prevIndex + 1 : 0 // Revenir au début de la liste si c'est la fin
        : prevIndex > 0 ? prevIndex - 1 : data.length - 1 // Passer au dernier élément si c'est le début
    );
  }, [data]);

  return (
      <Card className="flex items-center justify-between m-4">
        <div className=" flex items-center justify-between w-40 pl-6">
          <MediaPlayer
            channel={data[selectedChannelIndex]}
            onChangeChannel={handleChangeChannel}
          />
        </div>
        <img src="/img/logo1.png" width={250} height={100} alt="Logo" />
        <div className="flex items-center mr-3">
          <ModeToggle />
        </div>
      </Card>
    
  );
}
