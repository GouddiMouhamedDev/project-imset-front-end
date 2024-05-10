import { useRef, useState } from "react";
import { IMediaPlayerProps } from "./mediaPlayer.interface";
import { TbPlayerPlayFilled, TbPlayerPauseFilled, TbPlayerSkipBack, TbPlayerSkipForward } from 'react-icons/tb';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { Slider } from "@radix-ui/react-slider";

export default function MediaPlayer(props: IMediaPlayerProps) {
  const { channel, onChangeChannel } = props;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50); // Initialiser le volume à 50%

  const audioRef: any = useRef();

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      setLoading(true);
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  return (
    <div className="media-player-container h-30  flex flex-col items-center justify-center">
      <p className="text-base font-bold ">{channel.title}</p>
      <input
      className="py-1"
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
      <div className="flex items-center justify-center ">
        <Button
          className="text-2xl  mr-4"
          onClick={() => {
            onChangeChannel(false);
            if (isPlaying) {
              setLoading(true);
              setIsPlaying(true);
            }
          }}
        >
          <TbPlayerSkipBack />
        </Button>
        <Button className="player-container" onClick={handlePlayPause}>
          {isPlaying && !loading ? (
            <TbPlayerPauseFilled className="text-3xl " />
          ) : !isPlaying && !loading ? (
            <TbPlayerPlayFilled className="text-3xl" />
          ) : (
            <AiOutlineLoading3Quarters className="text-3xl  animate-spin" />
          )}
        </Button>
        <Button
          className="text-2xl ml-4"
          onClick={() => {
            onChangeChannel(true);
            if (isPlaying) {
              setLoading(true);
              setIsPlaying(true);
            }
          }}
        >
          <TbPlayerSkipForward />
        </Button>
      </div>
      
      
   
      <audio
        className="audio "
        ref={audioRef}
        src={channel.url}
        autoPlay={isPlaying}
        onProgress={() => setLoading(false)}
        controls={false} // Masquer les contrôles par défaut
      />
    </div>
  );
}
