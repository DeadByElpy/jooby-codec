// /**
//  * Information about current value.
//  *
//  * @packageDocumentation
//  *
//  * @example create command instance from command body hex dump
//  * ```js
//  * import * as current from 'jooby-codec/analog/commands/uplink/current.js';
//  *
//  * // simple response channels
//  * const bytes = [0x80, 0x00, 0x01, 0x56];
//  *
//  * // decoded payload
//  * const parameters = current.fromBytes(bytes);
//  *
//  * console.log(parameters);
//  * // output:
//  * {
//  *     isMagneticInfluence: true,
//  *     value: 342
//  * }
//  * ```
//  *
//  * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrent.md#response)
//  */

// import * as command from '../../utils/command.js';
// import * as types from '../../../types.js';
// import CommandBinaryBuffer, {ICommandBinaryBuffer, ILegacyCounter} from '../../utils/CommandBinaryBuffer.js';


// interface ICurrentParameters {
//     isMagneticInfluence: boolean;
//     value: types.TUint16;
// }

// export const id: types.TCommandId = 0x07;
// export const name: types.TCommandName = 'current';
// export const headerSize = 2;

// const COMMAND_BODY_MAX_SIZE = 4;

// export const examples: command.TCommandExamples = {
//     'simple response channels': {
//         id,
//         name,
//         headerSize,
//         parameters: {isMagneticInfluence: true, value: 342},
//         bytes: [
//             0x07, 0x04,
//             0x80, 0x00, 0x01, 0x56
//         ]
//     }
// };


// /**
//  * Decode command parameters.
//  *
//  * @param data - only body (without header)
//  * @returns command payload
//  */
// export const fromBytes = ( data: types.TBytes ): ILegacyCounter => {
//     if ( data.length > COMMAND_BODY_MAX_SIZE ) {
//         throw new Error(`Wrong buffer size: ${data.length}.`);
//     }

//     const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

//     return {buffer.getLegacyCounter()};
// };


// /**
//  * Encode command parameters.
//  *
//  * @param parameters - command payload
//  * @returns full message (header with body)
//  */
// export const toBytes = (parameters: ICurrentParameters): types.TBytes => {
//     const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

//     buffer.setBoolean(parameters.isMagneticInfluence);
//     buffer.setUint16(parameters.value);

//     return command.toBytes(id, buffer.data);
// };
