import {TBytes, TUint8} from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {ICommandParameters, TCommandExamples} from '../../utils/command.js';


/**
 * CorrectTime2000 response command parameters
 *
 * @example
 * {status: 1}
 */
interface ICorrectTime2000ResponseParameters extends ICommandParameters {
    status: TUint8
}


export const id = 0x0c;
export const headerSize = 2;

const COMMAND_BODY_SIZE = 1;

export const examples: TCommandExamples = {
    'time correction failure': {
        id,
        headerSize,
        parameters: {status: 0},
        bytes: [
            0x0c, 0x01,
            0x00
        ]
    },
    'time correction success': {
        id,
        headerSize,
        parameters: {status: 1},
        bytes: [
            0x0c, 0x01,
            0x01
        ]
    }
};


// data - only body (without header)
export const fromBytes = ( data: TBytes ): ICorrectTime2000ResponseParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(data, false);
    const parameters = {
        status: buffer.getUint8()
    };

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return parameters;
};

// returns full message - header with body
export const toBytes = ( parameters: ICorrectTime2000ResponseParameters ): TBytes => {
    const {status} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(status);

    return command.toBytes(id, buffer.data);
};
