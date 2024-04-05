/**
 * Information about multi-channel currents during specific hours.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as hourMC from 'jooby-codec/analog/commands/uplink/hourMC.js';
 *
 * // 4 first channels at 2023.12.23 12:00:00 GMT
 * const bytes = [
 *     0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0xc0,
 *     0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b
 * ];
 *
 * // decoded payload
 * const parameters = hourMC.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hours: 2,
 *     channelList: [
 *         {value: 131, index: 1, diff: [10]},
 *         {value: 832, index: 2, diff: [12]},
 *         {value: 38, index: 3, diff: [8]},
 *         {value: 234, index: 4, diff: [11]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/HourMC.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHours, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export interface IHourMCParameters {
    channelList: Array<IChannelHours>;
    startTime2000: TTime2000;
    hours: number;
}

export const id: types.TCommandId = 0x17;
export const name: types.TCommandName = 'hourMC';
export const headerSize = 2;

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;

export const examples: command.TCommandExamples = {
    '4 first channels at 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 756648000,
            hours: 2,
            channelList: [
                {index: 1, value: 131, diff: [10]},
                {index: 2, value: 832, diff: [12]},
                {index: 3, value: 38, diff: [8]},
                {index: 4, value: 234, diff: [11]}
            ]
        },
        bytes: [
            0x17, 0x0f,
            0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0xc0,
            0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IHourMCParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getChannelsValuesWithHourDiff();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IHourMCParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {startTime2000, hours, channelList} = parameters;

    buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
