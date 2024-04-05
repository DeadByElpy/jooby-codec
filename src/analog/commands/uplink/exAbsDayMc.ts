/**
 * Command for retrieving absolute day values of channels.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as exAbsDayMC from 'jooby-codec/analog/commands/uplink/exAbsDayMC.js';
 *
 * // absolute day value for 2023.03.10 00:00:00 GMT
 * const bytes = [
 *     0x2e, 0x6a, 0x01, 0x83, 0xd6, 0x02
 * ];
 *
 * // decoded payload
 * const parameters = exAbsDayMC.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 731721600,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 1,
 *             value: 342
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/ExAbsDayMC.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannelAbsoluteValue} from '../../utils/CommandBinaryBuffer.js';


interface IExAbsDayMCParameters {
    channelList: Array<IChannelAbsoluteValue>;
    startTime2000: TTime2000;
}

export const id: types.TCommandId = 0x0b1f;
export const name: types.TCommandName = 'exAbsDayMC';
export const headerSize = 3;

// date 2 bytes, channelList 3 bytes (max channelList: 14)
// 5 + (14 channelList * (1 byte pulse coefficient + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 89;

export const examples: command.TCommandExamples = {
    'absolute day value for 2023.03.10 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 731721600,
            channelList: [
                {pulseCoefficient: 100, index: 1, value: 342}
            ]
        },
        bytes: [
            0x1f, 0x0b, 0x06,
            0x2e, 0x6a, 0x01, 0x83, 0xd6, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IExAbsDayMCParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const channelList = buffer.getChannelsWithAbsoluteValues();

    return {startTime2000: getTime2000FromDate(date), channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IExAbsDayMCParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {startTime2000, channelList} = parameters;

    buffer.setDate(startTime2000);
    buffer.setChannelsWithAbsoluteValues(channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
