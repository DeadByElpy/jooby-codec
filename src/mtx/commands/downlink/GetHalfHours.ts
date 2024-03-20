import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {IDate} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetHalfHoursResponse from '../uplink/GetHalfHoursResponse.js';


const COMMAND_ID = 0x15;
const COMMAND_SIZE = 3;


const examples: TCommandExampleList = [
    {
        name: 'request half hour data for 2024.03.22 00:00:00 GMT',
        parameters: {
            year: 24,
            month: 3,
            date: 22
        },
        hex: {header: '15 03', body: '18 03 16'}
    }
];


/**
 * Downlink command to get active A+ energy in half hours by date.
 *
 * The corresponding uplink command: {@link GetHalfHoursResponse}.
 *
 * @example
 * ```js
 * import GetHalfHours from 'jooby-codec/mtx/commands/downlink/GetHalfHours.js';
 *
 * const command = new GetHalfHours({
 *     year: 24,
 *     month: 3,
 *     date: 22,
 * });
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 15 03 18 03 16
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetHalfHours.md#request)
 */
class GetHalfHours extends Command {
    constructor ( public parameters: IDate ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetHalfHours(buffer.getDate());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setDate(parameters);

        return buffer.toUint8Array();
    }
}


export default GetHalfHours;
