/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog/message/downlink';
 * import * as downlinkCommands from 'jooby-codec/analog/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.correctTime2000.id,
 *         parameters: {sequenceNumber: 45, seconds: -120}
 *     }
 * ];
 * const bytes = message.toBytes(commands);
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // output:
 * '[12,2,45,136,254]'
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // output:
 * '0c 02 2d 88 fe'
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/downlink/index.js';
import * as wrappers from './wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);
export const toMessage = wrappers.getToMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.correctTime2000.id] = commands.correctTime2000.toBytes;
toBytesMap[commands.getCurrent.id] = commands.getCurrent.toBytes;
toBytesMap[commands.getCurrentMc.id] = commands.getCurrentMc.toBytes;
toBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.toBytes;
toBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.toBytes;
toBytesMap[commands.getStatus.id] = commands.getStatus.toBytes;
toBytesMap[commands.getTime2000.id] = commands.getTime2000.toBytes;
toBytesMap[commands.setTime2000.id] = commands.setTime2000.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.correctTime2000.id] = commands.correctTime2000.fromBytes;
fromBytesMap[commands.getCurrent.id] = commands.getCurrent.toBytes;
fromBytesMap[commands.getCurrentMc.id] = commands.getCurrentMc.toBytes;
fromBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.fromBytes;
fromBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.fromBytes;
fromBytesMap[commands.getStatus.id] = commands.getStatus.fromBytes;
fromBytesMap[commands.getTime2000.id] = commands.getTime2000.fromBytes;
fromBytesMap[commands.setTime2000.id] = commands.setTime2000.fromBytes;

nameMap[commands.correctTime2000.id] = commands.correctTime2000.name;
nameMap[commands.getCurrent.id] = commands.getCurrent.name;
nameMap[commands.getCurrentMc.id] = commands.getCurrentMc.name;
nameMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.name;
nameMap[commands.getLmicInfo.id] = commands.getLmicInfo.name;
nameMap[commands.getStatus.id] = commands.getStatus.name;
nameMap[commands.getTime2000.id] = commands.getTime2000.name;
nameMap[commands.setTime2000.id] = commands.setTime2000.name;
