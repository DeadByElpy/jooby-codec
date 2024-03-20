import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {TInt32, TInt16} from '../../../types.js';


interface IGetCurrentValuesResponseParameters {
    /** active power in A channel */
    powerA: TInt32,
    /** current in A channel */
    iaRms: TInt32,
    /** voltage in A and B channels */
    vavbRms: TInt32,
    /** reactive power in A channel */
    varA: TInt32,
    /** power factor (cos φ) in  A channel */
    pfA: TInt16,
    /** current in B channel */
    ibRms: TInt32,
    /** active power in B channel */
    powerB: TInt32,
    /** reactive power in B channel */
    varB: TInt32,
    /** power factor (cos φ) in B channel */
    pfB: TInt16
}


const COMMAND_ID = 0x0d;
const COMMAND_SIZE = 32;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            powerA: 2349234,
            iaRms: 4061779,
            vavbRms: 302729,
            varA: 106789,
            pfA: 3267,
            ibRms: 304779,
            powerB: 106280,
            varB: 107292,
            pfB: 3767
        },
        hex: {header: '0d 20', body: '00 23 d8 b2 00 3d fa 53 00 04 9e 89 00 01 a1 25 0c c3 00 04 a6 8b 00 01 9f 28 00 01 a3 1c 0e b7'}
    }
];


/**
 * Uplink command to get current values like voltage, power, etc.
 *
 * The corresponding downlink command: `GetCurrentValues`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetCurrentValuesResponse from 'jooby-codec/obis-observer/commands/uplink/GetCurrentValuesResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x00, 0x23, 0xd8, 0xb2, 0x00, 0x3d, 0xfa, 0x53, 0x00, 0x04, 0x9e, 0x89, 0x00, 0x01, 0xa1, 0x25,
 *     0x0c, 0xc3, 0x00, 0x04, 0xa6, 0x8b, 0x00, 0x01, 0x9f, 0x28, 0x00, 0x01, 0xa3, 0x1c, 0x0e, 0xb7
 * ]);
 * const command = GetCurrentValuesResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     powerA: 2349234,
 *     iaRms: 4061779,
 *     vavbRms: 302729,
 *     varA: 106789,
 *     pfA: 3267,
 *     ibRms: 304779,
 *     powerB: 106280,
 *     varB: 107292,
 *     pfB: 3767
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetCurrentValues.md#response)
 */
class GetCurrentValuesResponse extends Command {
    constructor ( public parameters: IGetCurrentValuesResponseParameters ) {
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

        return new GetCurrentValuesResponse({
            powerA: buffer.getInt32(),
            iaRms: buffer.getInt32(),
            vavbRms: buffer.getInt32(),
            varA: buffer.getInt32(),
            pfA: buffer.getInt16(),
            ibRms: buffer.getInt32(),
            powerB: buffer.getInt32(),
            varB: buffer.getInt32(),
            pfB: buffer.getInt16()
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
        buffer.setUint32(parameters.powerA);
        buffer.setUint32(parameters.iaRms);
        buffer.setUint32(parameters.vavbRms);
        buffer.setUint32(parameters.varA);
        buffer.setUint16(parameters.pfA);
        buffer.setUint32(parameters.ibRms);
        buffer.setUint32(parameters.powerB);
        buffer.setUint32(parameters.varB);
        buffer.setUint16(parameters.pfB);

        return buffer.toUint8Array();
    }
}


export default GetCurrentValuesResponse;
