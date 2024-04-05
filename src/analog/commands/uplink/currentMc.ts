/**
 * Information about multi-channel currents.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as currentMC from 'jooby-codec/analog/commands/uplink/currentMC.js';
 *
 * // 4 first channels
 * const bytes = [0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c];
 *
 * // decoded payload
 * const parameters = currentMC.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     channelList: [
 *         {index: 1, value: 131},
 *         {index: 2, value: 8},
 *         {index: 3, value: 10},
 *         {index: 4, value: 12}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrentMC.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {IChannelValue, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export interface ICurrentMCParameters {
    channelList: Array<IChannelValue>;
}

export const id: types.TCommandId = 0x18;
export const name: types.TCommandName = 'currentMC';
export const headerSize = 2;

// 2 bytes for 7 channelList + (7 channelList * 5 byte for current value of channel)
const COMMAND_BODY_MAX_SIZE = 37;

export const examples: command.TCommandExamples = {
    '4 first channels': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {index: 1, value: 131},
                {index: 2, value: 8},
                {index: 3, value: 10},
                {index: 4, value: 12}
            ]
        },
        bytes: [
            0x18, 0x06,
            0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c
        ]
    },
    'single channel 2': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {index: 2, value: 50}
            ]
        },
        bytes: [
            0x18, 0x02,
            0x02, 0x32
        ]
    },
    'channels 5, 6, 12': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {index: 5, value: 8146},
                {index: 6, value: 164},
                {index: 12, value: 75}
            ]
        },
        bytes: [
            0x18, 0x07,
            0xb0, 0x10, 0xd2, 0x3f, 0xa4, 0x01, 0x4b
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): ICurrentMCParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const parameters: ICurrentMCParameters = {channelList: []};
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const channelList = buffer.getChannels();

    parameters.channelList = channelList.map(channelIndex => ({
        value: buffer.getExtendedValue(),
        index: channelIndex
    }) as IChannelValue);

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ICurrentMCParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {channelList} = parameters;

    buffer.setChannels(channelList);
    channelList.forEach(({value}) => {
        buffer.setExtendedValue(value);
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
