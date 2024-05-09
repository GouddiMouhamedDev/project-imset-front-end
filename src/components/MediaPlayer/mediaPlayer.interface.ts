import { IRadioChannel } from "@/types/radio.interface";

export interface IMediaPlayerProps {
    channel: IRadioChannel
    onChangeChannel: Function
}