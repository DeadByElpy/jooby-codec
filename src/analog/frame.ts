import Command from './Command.js';
import * as Frame from '../utils/frame.js';
import * as Message from './message.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';


interface IAnalogFrame {
    frame: Frame.IFrame,
    message: Message.IMessage
}


export const getCommands = ( {frame, message}: IAnalogFrame, isStrict: boolean = false ): Array<Command> => {
    if ( isStrict && !frame.isValid ) {
        return [];
    }

    return Message.getCommands(message, isStrict);
};

export const toFrame = ( commands: Array<Command> ): IAnalogFrame => {
    const message = Message.toMessage(commands);

    return {
        message,
        frame: Frame.toFrame(message.bytes)
    };
};

export const fromBytes = ( data: Uint8Array, config?: Message.IMessageConfig ): IAnalogFrame => {
    const frame = Frame.fromBytes(data);
    const message = Message.fromBytes(frame.content, config);

    return {frame, message};
};

export const fromHex = ( data: string, config?: Message.IMessageConfig ) => (
    fromBytes(getBytesFromHex(data), config)
);

export const fromBase64 = ( data: string, config?: Message.IMessageConfig ) => (
    fromBytes(getBytesFromBase64(data), config)
);

export const fromFrames = ( frames: Array<Frame.IFrame>, config?: Message.IMessageConfig ): Array<IAnalogFrame> => frames.map(frame => {
    const message = Message.fromBytes(frame.content, config);

    return {frame, message};
});
