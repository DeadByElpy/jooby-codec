/**
 * Command for retrieving absolute values of channels with hourly differences.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as exAbsHourMC from 'jooby-codec/analog/commands/uplink/exAbsHourMC.js';
 *
 * // 1 channel at 2023.03.10 12:00:00 GMT
 * const bytes = [
 *     0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01
 * ];
 *
 * // decoded payload
 * const parameters = exAbsHourMC.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 731764800,
 *     hours: 2,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 1,
 *             value: 342457,
 *             diff: [128]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/ExAbsHourMC.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate, getDateFromTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHourAbsoluteValue, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export interface IUplinkExAbsHourMCParameters {
    channelList: Array<IChannelHourAbsoluteValue>;
    startTime2000: TTime2000;
    hours: number;
}

export const id: types.TCommandId = 0x0a1f;
export const name: types.TCommandName = 'exAbsHourMC';
export const headerSize = 3;

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;

export const examples: command.TCommandExamples = {
    '1 channel at 2023.03.10 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 731764800,
            hours: 2,
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 1,
                    value: 342457,
                    diff: [128]
                }
            ]
        },
        bytes: [
            0x1f, 0x0a, 0x0a,
            0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IUplinkExAbsHourMCParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const {hour, hours} = buffer.getHours();
    const channelList = buffer.getChannelsAbsoluteValuesWithHourDiff(hours);

    date.setUTCHours(hour);

    return {startTime2000: getTime2000FromDate(date), hours, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUplinkExAbsHourMCParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {startTime2000, hours, channelList} = parameters;

    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    buffer.setDate(startTime2000);
    buffer.setHours(hour, hours);
    buffer.setChannelsAbsoluteValuesWithHourDiff(channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
