import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetExtendedCurrentValuesResponse from '../uplink/GetExtendedCurrentValuesResponse.js';


const COMMAND_ID = 0x3a;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '3a 00', body: ''}
    }
];


/**
 * Downlink command to get extended current values like temperature and frequency.
 *
 * The corresponding uplink command: {@link GetExtendedCurrentValuesResponse}.
 *
 * @example
 * ```js
 * import GetExtendedCurrentValues from 'jooby-codec/mtx/commands/downlink/GetExtendedCurrentValues.js';
 *
 * const command = new GetExtendedCurrentValues();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 3a 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetExtendedCurrentValues.md#request)
 */
class GetExtendedCurrentValues extends Command {
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
        return new GetExtendedCurrentValues();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetExtendedCurrentValues;
