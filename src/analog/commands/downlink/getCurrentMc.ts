/**
 * Command to request current values from device channels.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getCurrentMc from 'jooby-codec/analog/commands/downlink/getCurrentMc.js';
 *
 * const bytes = getCurrentMc.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // [24, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrentMC.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x18;
export const name: types.TCommandName = 'getCurrentMc';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x18, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ) => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
