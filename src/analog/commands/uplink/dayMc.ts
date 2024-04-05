/**
 * Information about multi-channel currents during a day.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as dayMC from 'jooby-codec/analog/commands/uplink/dayMC.js';
 *
 * // 4 channels at 2023.12.23 00:00:00 GMT
 * const bytes = [0x2f, 0x97, 0x55, 0x0c, 0x83, 0x01, 0x08, 0x0a];
 *
 * // decoded payload
 * const parameters = dayMC.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 756604800,
 *     channelList: [
 *         {value: 12, index: 1},
 *         {value: 131, index: 3},
 *         {value: 8, index: 5},
 *         {value: 10, index: 7}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/DayMC.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannelValue} from '../../utils/CommandBinaryBuffer.js';
import {TTime2000, getTime2000FromDate} from '../../utils/time.js';
import {ICurrentMCParameters} from './currentMc.js';


export interface IDayMCParameters extends ICurrentMCParameters {
    startTime2000: TTime2000;
}

export const id: types.TCommandId = 0x16;
export const name: types.TCommandName = 'dayMC';
export const headerSize = 2;

// 2 byte for date + 2 for channels (max channels: 7)
// 4 + (7 * 4)
const COMMAND_BODY_MAX_SIZE = 32;

export const examples: command.TCommandExamples = {
    '4 channels at 2023.12.23 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 756604800,
            channelList: [
                {index: 3, value: 131},
                {index: 5, value: 8},
                {index: 7, value: 10},
                {index: 1, value: 12}
            ]
        },
        bytes: [
            0x16, 0x08,
            0x2f, 0x97, 0x55, 0x0c, 0x83, 0x01, 0x08, 0x0a
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IDayMCParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const channels = buffer.getChannels();
    const channelList = channels.map(channelIndex => ({
        value: buffer.getExtendedValue(),
        index: channelIndex
    }) as IChannelValue);

    return {startTime2000: getTime2000FromDate(date), channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDayMCParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {channelList, startTime2000} = parameters;

    buffer.setDate(startTime2000);
    buffer.setChannels(channelList);
    channelList.forEach(({value}) => {
        buffer.setExtendedValue(value);
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
