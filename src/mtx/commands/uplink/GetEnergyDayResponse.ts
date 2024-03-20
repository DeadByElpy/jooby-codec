import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IEnergies} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {IDate} from '../../../types.js';


interface IGetEnergyDayResponseParameters {
    date: IDate,
    energies: IEnergies
}


const COMMAND_ID = 0x16;
const COMMAND_SIZE = 19;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            energies: [40301230, 3334244, 2333, 2145623]
        },
        hex: {
            header: '16 13',
            body: '18 03 16 02 66 f2 ae 00 32 e0 64 00 00 09 1d 00 20 bd 57'
        }
    }
];


/**
 * Uplink command to get active A+ energy by date.
 *
 * The corresponding downlink command: `GetEnergyDay`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetEnergyDayResponse from 'jooby-codec/obis-observer/commands/uplink/GetEnergyDayResponse.js';
 *
 * const commandBody = new Uint8Array([0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]);
 * const command = GetEnergyDayResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energies: [40301230, 3334244, 2333, 2145623]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetEnergyDay.md#response)
 */
class GetEnergyDayResponse extends Command {
    constructor ( public parameters: IGetEnergyDayResponseParameters ) {
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

        return new GetEnergyDayResponse({date: buffer.getDate(), energies: buffer.getEnergies()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setDate(parameters.date);
        buffer.setEnergies(parameters.energies);

        return buffer.toUint8Array();
    }
}


export default GetEnergyDayResponse;
