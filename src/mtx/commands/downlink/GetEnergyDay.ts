import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {TEnergyType} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {IDate} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetEnergyDayResponse from '../uplink/GetEnergyDayResponse.js';


interface IGetEnergyDayParameters {
    date: IDate,
    energyType?: TEnergyType
}


const COMMAND_ID = 0x16;
const MIN_COMMAND_SIZE = 3;
const MAX_COMMAND_SIZE = 4;


const examples: TCommandExampleList = [
    {
        name: 'request day values for 2024.03.22 00:00:00 GMT',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            }
        },
        hex: {header: '16 03', body: '18 03 16'}
    },
    {
        name: 'request day values for 2024.03.22 00:00:00 GMT',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            energyType: 1
        },
        hex: {header: '16 04', body: '18 03 16 01'}
    }
];


/**
 * Downlink command to get day energy A+ by default or selected energy type for 4 tariffs (T1-T4) for date.
 *
 * The corresponding uplink command: {@link GetEnergyDayResponse}.
 *
 * @example
 * ```js
 * import GetEnergyDay from 'jooby-codec/mtx/commands/downlink/GetEnergyDay.js';
 *
 * const command = new GetEnergyDay({
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energyType: 1
 * });
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 16 04 18 03 16 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEnergyDay.md#request)
 */
class GetEnergyDay extends Command {
    constructor ( public parameters: IGetEnergyDayParameters ) {
        super();

        this.size = parameters.energyType ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = MAX_COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        let energyType;

        if ( data.byteLength === MAX_COMMAND_SIZE ) {
            energyType = data[0] as TEnergyType;
        }

        return new GetEnergyDay({
            energyType,
            date: buffer.getDate()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setDate(parameters.date);

        if ( parameters.energyType ) {
            buffer.setUint8(parameters.energyType);
        }

        return buffer.toUint8Array();
    }
}


export default GetEnergyDay;
