import { useRef, useState } from "react";
import { IMediaPlayerProps } from "./mediaPlayer.interface";
import { TbPlayerPlayFilled, TbPlayerPauseFilled, TbPlayerSkipBack, TbPlayerSkipForward } from 'react-icons/tb';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function MediaPlayer (props: IMediaPlayerProps) {
    const {channel, onChangeChannel } = props;

    const [ isPlaying, setIsPlaying ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

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

    return (
        <div className="media-player-container h-30 pt-2 flex flex-col items-center justify-center">
           
            <p className="text-base font-bold">{channel.title}</p>
            <p className="text-sm text-red-500 mb-4"><span className="text-base">•</span> Online</p>
            <div className="flex items-center justify-center mb-4">
                <button 
                    className="text-2xl text-gray-600 mr-4"
                    onClick={() => {
                        onChangeChannel(false);
                        if (isPlaying) {
                            setLoading(true);
                            setIsPlaying(true);
                        }
                    }}
                >
                    <TbPlayerSkipBack/>
                </button>
                <button 
                    className="player-container"
                    onClick={handlePlayPause}
                >
                    {isPlaying && !loading
                        ? <TbPlayerPauseFilled className="text-3xl text-gray-600"/> 
                        : !isPlaying && !loading 
                            ? <TbPlayerPlayFilled className="text-3xl text-gray-600"/> 
                            : <AiOutlineLoading3Quarters className="text-3xl text-gray-600 animate-spin"/> 
                    }
                </button>
                <button
                    className="text-2xl text-gray-600 ml-4"
                    onClick={() => {
                        onChangeChannel(true);
                        if (isPlaying) {
                            setLoading(true);
                            setIsPlaying(true);
                        }
                    }}
                >
                    <TbPlayerSkipForward/>
                </button>
            </div>
            <audio 
                className="audio" 
                ref={audioRef} 
                src={channel.url} 
                autoPlay={isPlaying}
                onProgress={() => setLoading(false)}
                controls={false} // Masquer les contrôles par défaut
            />
        </div>
    );
}
