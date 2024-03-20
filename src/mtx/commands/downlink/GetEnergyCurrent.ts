import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetEnergyCurrentResponse from '../uplink/GetEnergyCurrentResponse.js';


const COMMAND_ID = 0x0f;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '0f 00', body: ''}
    }
];


/**
 * Downlink command to get current energy A+ by default or selected energy type for 4 tariffs (T1-T4).
 *
 * The corresponding uplink command: {@link GetEnergyCurrentResponse}.
 *
 * @example
 * ```js
 * import GetEnergyCurrent from 'jooby-codec/mtx/commands/downlink/GetEnergyCurrent.js';
 *
 * const command = new GetEnergyCurrent();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0f 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEnergyCurrent.md#request)
 */
class GetEnergyCurrent extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( ) {
        return new GetEnergyCurrent();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetEnergyCurrent;
