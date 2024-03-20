import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetCurrentValuesResponse from '../uplink/GetCurrentValuesResponse.js';


const COMMAND_ID = 0x0d;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '0d 00', body: ''}
    }
];


/**
 * Downlink command to get current values like voltage, power, etc.
 *
 * The corresponding uplink command: {@link GetCurrentValuesResponse}.
 *
 * @example
 * ```js
 * import GetCurrentValues from 'jooby-codec/mtx/commands/downlink/GetCurrentValues.js';
 *
 * const command = new GetCurrentValues();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0d 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetCurrentValues.md#request)
 */
class GetCurrentValues extends Command {
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
    static fromBytes () {
        return new GetCurrentValues();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetCurrentValues;
