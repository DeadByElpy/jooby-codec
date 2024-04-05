/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog/message/uplink';
 *
 * // binary data received from a device
 * const bytes = [0x0c, 0x01, 0x00, 0x58];
 *
 * // decode it
 * const payload = message.fromBytes(bytes);
 *
 * if ( 'error' in payload ) {
 *     console.log('decode failure:', payload.error, payload.message);
 * } else {
 *     console.log('message decoded:', payload.commands);
 *     // output:
 *     [
 *         {
 *             id: 12,
 *             headerSize: 2,
 *             bytes: [ 12, 1, 0 ],
 *             parameters: { status: 0 }
 *         }
 *     ]
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/uplink/index.js';
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
toBytesMap[commands.currentMc.id] = commands.currentMc.toBytes;
toBytesMap[commands.dayMc.id] = commands.dayMc.toBytes;
toBytesMap[commands.exAbsDayMc.id] = commands.exAbsDayMc.toBytes;
toBytesMap[commands.exAbsHourMc.id] = commands.exAbsHourMc.toBytes;
toBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.toBytes;
toBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.toBytes;
toBytesMap[commands.hourMc.id] = commands.hourMc.toBytes;
toBytesMap[commands.setTime2000.id] = commands.setTime2000.toBytes;
toBytesMap[commands.status.id] = commands.status.toBytes;
toBytesMap[commands.time2000.id] = commands.time2000.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.correctTime2000.id] = commands.correctTime2000.fromBytes;
fromBytesMap[commands.currentMc.id] = commands.currentMc.fromBytes;
fromBytesMap[commands.dayMc.id] = commands.dayMc.fromBytes;
fromBytesMap[commands.exAbsDayMc.id] = commands.exAbsDayMc.fromBytes;
fromBytesMap[commands.exAbsHourMc.id] = commands.exAbsHourMc.fromBytes;
fromBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.fromBytes;
fromBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.fromBytes;
fromBytesMap[commands.hourMc.id] = commands.hourMc.fromBytes;
fromBytesMap[commands.setTime2000.id] = commands.setTime2000.fromBytes;
fromBytesMap[commands.status.id] = commands.status.fromBytes;
fromBytesMap[commands.time2000.id] = commands.time2000.fromBytes;

nameMap[commands.correctTime2000.id] = commands.correctTime2000.name;
nameMap[commands.currentMc.id] = commands.currentMc.name;
nameMap[commands.dayMc.id] = commands.dayMc.name;
nameMap[commands.exAbsDayMc.id] = commands.exAbsDayMc.name;
nameMap[commands.exAbsHourMc.id] = commands.exAbsHourMc.name;
nameMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.name;
nameMap[commands.getLmicInfo.id] = commands.getLmicInfo.name;
nameMap[commands.hourMc.id] = commands.hourMc.name;
nameMap[commands.setTime2000.id] = commands.setTime2000.name;
nameMap[commands.status.id] = commands.status.name;
nameMap[commands.time2000.id] = commands.time2000.name;
