import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {TEnergyType} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetEnergyCurrentResponse from '../uplink/GetEnergyCurrentResponse.js';


interface IGetEnergyCurrentParameters {
    energyType?: TEnergyType
}


const COMMAND_ID = 0x0f;
const MIN_COMMAND_SIZE = 0;
const MAX_COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '0f 00', body: ''}
    },
    {
        name: 'get A+ energy',
        hex: {header: '0f 01', body: '01'}
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
    constructor ( public parameters: IGetEnergyCurrentParameters ) {
        super();

        this.size = parameters.energyType ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = MAX_COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        let energyType;

        if ( data.byteLength === MAX_COMMAND_SIZE ) {
            energyType = data[0] as TEnergyType;
        }

        return new GetEnergyCurrent({energyType});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const bytes = [COMMAND_ID, this.size];
        const {energyType} = this.parameters;

        if ( energyType ) {
            bytes.push(energyType);
        }

        return new Uint8Array(bytes);
    }
}


export default GetEnergyCurrent;
