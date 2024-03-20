import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {TInt16} from '../../../types.js';


interface IGetExtendedCurrentValuesResponseParameters {
    /** device temperature */
    temperature: TInt16,
    /** The frequency of voltage in the power grid */
    frequency: TInt16
}


const COMMAND_ID = 0x3a;
const COMMAND_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            temperature: 67,
            frequency: 60
        },
        hex: {header: '3a 04', body: '00 43 00 3c'}
    }
];


/**
 * Uplink command to get extended current values like temperature and frequency.
 *
 * The corresponding downlink command: `GetExtendedCurrentValues`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetExtendedCurrentValuesResponse from 'jooby-codec/obis-observer/commands/uplink/GetExtendedCurrentValuesResponse.js';
 *
 * const commandBody = new Uint8Array([0x00, 0x43, 0x00, 0x3c]);
 * const command = GetExtendedCurrentValuesResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     temperature: 67,
 *     frequency: 60
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetExtendedCurrentValues.md#response)
 */
class GetExtendedCurrentValuesResponse extends Command {
    constructor ( public parameters: IGetExtendedCurrentValuesResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetExtendedCurrentValuesResponse({
            temperature: buffer.getInt16(),
            frequency: buffer.getInt16()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setUint16(parameters.temperature);
        buffer.setUint16(parameters.frequency);

        return buffer.toUint8Array();
    }
}


export default GetExtendedCurrentValuesResponse;
