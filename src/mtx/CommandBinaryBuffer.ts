import BinaryBuffer from '../utils/BinaryBuffer.js';
import * as bitSet from '../utils/bitSet.js';
import {IDeviceType} from './utils/deviceType.js';
import * as DeviceType from './utils/deviceType.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import {IDateTime, ITimeCorrectionParameters} from './utils/dateTime.js';
import {DATA_REQUEST} from './constants/frameTypes.js';
import {
    TUint8, TUint16, TUint32, TInt32, TYear2000, TMonth, TMonthDay, IDate
} from '../types.js';

/* eslint-disable */
import * as frameTypes from './constants/frameTypes.js';
import * as screenIds from './constants/screenIds.js';
/* eslint-enable */

export const frameHeaderSize = 5;

export interface IFrameHeader {
    /**
     * Frame type from the list of {@link frameTypes | available types}.
     */
    type: number,

    /**
     * Source device address.
     *
     * @example
     * 0x238a
     */
    source: number,

    /**
     * Destination device address.
     *
     * @example
     * 0xffff
     */
    destination: number
}

/**
 * Day profiles, seasons and special days are grouped into a tariff plan.
 * It allows determining the current tariff based on the date and time.
 */
export interface ITariffPlan {
    /**
     * tariff plan identifier
     */
    id: TUint32,

    /**
     * indicates the state of this tariff plan
     * (`1` - tariff table is valid, `0` - not valid)
     */
    tariffSet: TUint8,

    /**
     * the year when this plan is activated
     */
    activateYear: TYear2000,

    /**
     * the month when this plan is activated
     */
    activateMonth: TMonth,

    /**
     * the day of month when this plan is activated
     */
    activateDay: TMonthDay,

    /**
     * the number of special days in the tariff table
     * (max `26`)
     */
    specialProfilesArraySize: TUint8,

    /**
     * the number of seasons in the tariff table
     * (max `14`)
     */
    seasonProfilesArraySize: TUint8,

    /**
     * the number of days in the tariff table
     * (max `32`)
     */
    dayProfilesArraySize: TUint8
}

/**
 * Flags to show/hide {@link screenIds | available screens}.
 */
export interface IDisplaySetBaseOperatorParameter {
    SET_ALL_SEGMENT_DISPLAY: boolean,
    SOFTWARE_VERSION: boolean,
    TOTAL_ACTIVE_ENERGY: boolean,
    ACTIVE_ENERGY_T1: boolean,
    ACTIVE_ENERGY_T2: boolean,
    ACTIVE_ENERGY_T3: boolean,
    ACTIVE_ENERGY_T4: boolean,
    ACTIVE_POWER_PER_PHASE: boolean,
    ACTIVE_POWER_IN_NEUTRAL: boolean,
    CURRENT_IN_PHASE: boolean,
    CURRENT_IN_NEUTRAL: boolean,
    VOLTAGE: boolean,
    HOUR_MINUTE_SECOND: boolean,
    DATE_MONTH_YEAR: boolean,
    TOTAL_EXPORTED_ACTIVE_ENERGY: boolean,
    EXPORTED_ACTIVE_ENERGY_T1: boolean,
    EXPORTED_ACTIVE_ENERGY_T2: boolean,
    EXPORTED_ACTIVE_ENERGY_T3: boolean,
    EXPORTED_ACTIVE_ENERGY_T4: boolean,
    POWER_COEFFICIENT_PHASE_A: boolean,
    POWER_COEFFICIENT_PHASE_B: boolean,
    BATTERY_VOLTAGE: boolean,
    POWER_THRESHOLD_T1: boolean,
    POWER_THRESHOLD_T2: boolean,
    POWER_THRESHOLD_T3: boolean,
    POWER_THRESHOLD_T4: boolean,
    CURRENT_BALANCE: boolean,
}

export interface IDisplaySetOperatorParameter extends IDisplaySetBaseOperatorParameter {
    AUTO_SCREEN_SCROLLING: boolean
}

export interface IDisplaySetExtOperatorParameter extends IDisplaySetBaseOperatorParameter {
    MAGNET_INDUCTION: boolean,
    OPTOPORT_SPEED: boolean,
    SORT_DISPLAY_SCREENS: boolean
}

export interface IRelaySet1OperatorParameter {
    /**
     * Relay activation function (`1` - enabled, `0` - disabled).
     */
    RELAY_ON_Y: boolean,

    /**
     * Turn on by command from the center.
     */
    RELAY_ON_CENTER: boolean,

    /**
     * Turn on by button.
     */
    RELAY_ON_PB: boolean,

    /**
     * Turn on by tariff `T1`.
     */
    RELAY_ON_TARIFF_0: boolean,

    /**
     * Turn on by tariff `T2`.
     */
    RELAY_ON_TARIFF_1: boolean,

    /**
     * Turn on by tariff `T3`.
     */
    RELAY_ON_TARIFF_2: boolean,

    /**
     * Turn on by tariff `T4`.
     */
    RELAY_ON_TARIFF_3: boolean,

    /**
     * Turn on by restoration of good voltage.
     */
    RELAY_ON_V_GOOD: boolean
}

export interface IRelaySet2OperatorParameter {
    /**
     * Relay deactivation function (`1` - enabled, `0` - disabled).
     */
    RELAY_OFF_Y: boolean,

    /**
     * Turn off by command from the center.
     */
    RELAY_OFF_CENTER: boolean,

    /**
     * Turn off by tariff `T1`.
     */
    RELAY_OFF_TARIFF_0: boolean,

    /**
     * Turn off by tariff `T2`.
     */
    RELAY_OFF_TARIFF_1: boolean,

    /**
     * Turn off by tariff `T3`.
     */
    RELAY_OFF_TARIFF_2: boolean,

    /**
     * Turn off by tariff `T4`.
     */
    RELAY_OFF_TARIFF_3: boolean,

    /**
     * Turn off on load current exceeding.
     */
    RELAY_OFF_I_LIMIT: boolean,

    /**
     * Turn off on poor voltage.
     */
    RELAY_OFF_V_BAD: boolean
}

export interface IRelaySet3OperatorParameter {
    /**
     * Turn off on exceeding the power consumption limit for tariff `T1`.
     */
    RELAY_OFF_LIM_TARIFF_0: boolean,

    /**
     * Turn off on exceeding the power consumption limit for tariff `T2`.
     */
    RELAY_OFF_LIM_TARIFF_1: boolean,

    /**
     * Turn off on exceeding the power consumption limit for tariff `T3`.
     */
    RELAY_OFF_LIM_TARIFF_2: boolean,

    /**
     * Turn off on exceeding the power consumption limit for tariff `T4`.
     */
    RELAY_OFF_LIM_TARIFF_3: boolean,

    /**
     * Turn off on `cos(fi)`.
     */
    RELAY_OFF_PF_MIN: boolean
}

export interface IRelaySet4OperatorParameter {
    /**
     * Turn on after timeout {@link IOperatorParameters.timeoutRelayOn}
     */
    RELAY_ON_TIMEOUT: boolean,

    /**
     * Turn on based on saldo.
     */
    RELAY_ON_SALDO: boolean,

    /**
     * Turn off based on saldo.
     */
    RELAY_OFF_SALDO: boolean,

    /**
     * Turn off based on saldo with condition.
     */
    RELAY_OFF_SALDO_SOFT: boolean,

    /**
     * Turn off relay upon detection of a magnetic field.
     */
    RELAY_OFF_MAGNET: boolean,

    /**
     * Turn on after timeout {@link IOperatorParameters.timeoutRelayOn} (not used).
     */
    RELAY_ON_MAGNET_TIMEOUT: boolean,

    /**
     * Turn on relay after removal of the magnetic field.
     */
    RELAY_ON_MAGNET_AUTO: boolean
}

export interface IRelaySet5OperatorParameter {
    /**
     * Turn off relay upon detection of current inequality.
     */
    RELAY_OFF_UNEQUAL_CURRENT: boolean,

    /**
     * Turn on relay after turning off due to current inequality.
     */
    RELAY_ON_UNEQUAL_CURRENT: boolean,

    /**
     * Turn off relay upon detection of different-polarity powers in phase and neutral (only for `G` meter).
     */
    RELAY_OFF_BIPOLAR_POWER: boolean,

    /**
     * Turn on relay after deactivation due to different-polarity powers in phase and neutral (only for `G` meter)
     */
    RELAY_ON_BIPOLAR_POWER: boolean
}

export interface IDefine1OperatorParameter {
    /**
     * `1` - optoport is unlocked by button, `0` - optoport is unlocked (default is `0`).
     */
    BLOCK_KEY_OPTOPORT: boolean,

    /**
     * `1` - constant magnetic field screen (`104.21.017`)
     */
    MAGNET_SCREEN_CONST: boolean
}

export interface IOperatorParameters {
    /**
     * Maximum voltage threshold, mV.
     */
    vpThreshold: TUint32,

    /**
     * Minimum voltage threshold, mV.
     */
    vThreshold: TUint32,

    /**
     * Maximum current threshold, mA.
     */
    ipThreshold: TUint32,

    /**
     * Maximum power threshold for tariff `T1`, Watts.
     */
    pmaxThreshold0: TUint32,

    /**
     * Maximum power threshold for tariff `T2`, Watts.
     */
    pmaxThreshold1: TUint32,

    /**
     * Maximum power threshold for tariff `T3`, Watts.
     */
    pmaxThreshold2: TUint32,

    /**
     * Maximum power threshold for tariff `T4`, Watts.
     */
    pmaxThreshold3: TUint32,

    /**
     * Reserved byte.
     */
    speedOptoPort: TUint8,

    /**
     * Power averaging interval, in minutes.
     */
    tint: TUint8,

    /**
     * Start date of the monthly billing period.
     */
    calcPeriodDate: TUint8,

    /**
     * Display active time.
     */
    timeoutDisplay: TUint8,

    /**
     * Display active time for each screen.
     */
    timeoutScreen: TUint8,

    /**
     * Display settings for meter readings.
     */
    displaySet: IDisplaySetOperatorParameter,

    /**
     * Relay settings.
     */
    relaySet4: IRelaySet4OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet3: IRelaySet3OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet2: IRelaySet2OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet1: IRelaySet1OperatorParameter,

    /**
     * Display type on the remote display (`0` - `OBIS`, `1` - symbolic (not used)).
     */
    displayType: TUint8,

    /**
     * Integration period for energy profiles `A+`, `A-`, voltage VA `0`, `30` - `30` minutes, `15` - `15` minutes, `60` - `60` minutes.
     */
    ten: TUint8,

    /**
     * Reserved byte.
     */
    timeoutRefresh: TUint8,

    /**
     * Allowed correction interval (`15` minutes by default).
     */
    deltaCorMin: TUint8,

    /**
     * Timeout for relay shutdown upon magnetic interference, seconds.
     */
    timeoutMagnetOff: TUint8,

    /**
     * Timeout for relay activation after magnetic field removal, seconds.
     */
    timeoutMagnetOn: TUint8,

    /**
     * Setting for optoport and constant magnetic field screen.
     */
    define1: IDefine1OperatorParameter,

    /**
     * Timeout for automatic relay activation based on `IMAX`, `PMAX`, `IDIFF`, `COSFI`, minutes.
     */
    timeoutRelayOn: TUint8,

    /**
     * Timeout for relay activation based on `IMAX`, `PMAX`, `IDIFF`, `COSFI`, seconds.
     */
    timeoutRelayKey: TUint8,

    /**
     * Timeout for relay activation upon restoration of quality voltage, seconds.
     */
    timeoutRelayAuto: TUint8,

    /**
     * Timeout for relay deactivation due to poor voltage, seconds.
     */
    timeoutBadVAVB: TUint8,

    /**
     * Maximum threshold for the frequency of the grid voltage.
     */
    freqMax: TUint8,

    /**
     * Minimum threshold for the frequency of the grid voltage.
     */
    freqMin: TUint8,

    /**
     * Minimum threshold for the `cos(fi)` value.
     */
    phMin: TUint16,

    /**
     * Year of parameters recording.
     */
    year: TUint8,

    /**
     * Month of parameters recording.
     */
    month: TUint8,

    /**
     * Date of parameters recording.
     */
    date: TUint8,

    /**
     * The number of digits after the decimal point for displaying energy values.
     * (`0x00` - no digits, `0x01` - `1` digit, `0x02` - `2` digits, `0x03` - `3` digits)
     */
    energyDecimalPoint: TUint8,

    /**
     * Measurement type.
     * (`0` - active `|A|+`, `1` - active `A+`, `A-`)
     */
    typeMeter: TUint8,

    /**
     * Timeout for relay deactivation based on maximum current.
     */
    timeoutIMax: TUint8,

    /**
     * Timeout for relay deactivation based on maximum power.
     */
    timeoutPMax: TUint8,

    /**
     * Timeout for relay deactivation based on `cos(fi)`.
     */
    timeoutCos: TUint8,

    /**
     * `0` - `PMAX` = `POWER_A`; `1` - `PMAX` averaged power over the integration period.
     */
    pMaxDef: TUint8,

    /**
     * Setting for displaying meter readings on additional displays (long press).
     */
    displaySetExt: IDisplaySetExtOperatorParameter,

    /**
     * Timeout for relay deactivation based on current inequality (`5`).
     */
    timeoutUneqCurrent: TUint8,

    /**
     * Timeout for relay deactivation upon detection of power with different polarities (`5`).
     */
    timeoutBipolarPower: TUint8,

    /**
     * Relay settings.
     */
    relaySet5: IRelaySet5OperatorParameter,

    /**
     * Allowed correction period, in hours (`24` hours by default).
     */
    timeCorrectPeriod: TUint8,

    /**
     * Is the time correction with a transition across the half-hour boundary allowed.
     */
    timeCorrectPassHalfhour: boolean
}

export interface IDayProfile {
    /**
     * Period start hour.
     */
    hour: number,

    /**
     * Is it the first half of the hour (second - otherwise).
     */
    isFirstHalfHour: boolean,

    /**
     * Tariff number to apply for this period.
     */
    tariff: number
}

export interface ISeasonProfile {
    month: TMonth,

    date: TMonthDay,

    /**
     * List of day profile indexes.
     */
    dayIndexes: Array<TUint8>
}

export interface ISpecialDay {
    month: TMonth,

    date: TMonthDay,

    /**
     * Day profile index.
     */
    dayIndex: TUint8,

    /**
     * Is it periodic or not.
     */
    isPeriodic: boolean
}

export interface IDeviceId {
    /**
     * Device manufacturer (`001a79` at the moment)
     */
    manufacturer: string,

    /**
     * Device type.
     *
     * ID | Name
     * ---|------
     * 01 | MTX 1
     * 02 | MTX 3 direct (old)
     * 03 | MTX 3 transformer (old)
     * 04 | MTX 3 direct
     * 05 | MTX 3 transformer
     * 11 | MTX 1 new (two shunts)
     * 12 | MTX 3 direct new (shunts)
     * 13 | MTX 3 transformer new
     * 14 | MTX 1 pole
     * 15 | MTX RD remote display
     * 16 | MTX RR repeater
     * 21 | MTX 1 new, current transformers
     * 22 | MTX 3 direct new, current transformers
     * 80 | RF module
     * 81 | water meter
     */
    type: number,

    /**
     * Device production year.
     *
     * @example
     * 24
     */
    year: TYear2000,

    /**
     * Device serial number.
     *
     * @example
     * '1b1d6a'
     */
    serial: string
}

export {IDeviceType};

export interface ISaldoParameters {
    /**
     * Saldo coefficients for tariffs `T1`-`T4`.
     */
    coefficients: Array<TUint32>,

    /**
     * Decimal point in the saldo coefficient for the tariff (default is `4`).
     */
    decimalPointTariff: TUint8,

    /**
     * Threshold at which the saldo is indicated.
     */
    indicationThreshold: TInt32,

    /**
     * Threshold at which relay turns off based on saldo.
     */
    relayThreshold: TInt32,

    /**
     * Definitions setting the operating mode based on saldo.
     */
    mode: TUint8,

    /**
     * Not to deactivate based on saldo after.
     */
    saldoOffTimeBegin: TUint8,

    /**
     * Not to deactivate based on saldo before.
     */
    saldoOffTimeEnd: TUint8,

    /**
     * Decimal point for saldo indication.
     */
    decimalPointIndication: TUint8,

    /**
     * Power limitation based on saldo.
     */
    powerThreshold: TUint32,

    /**
     * Saldo credit limit.
     */
    creditThreshold: TInt32
}

export interface IEnergyPeriod {
    /** one of four tariffs (T1-T4) */
    tariff?: TUint8,
    /** value for period */
    energy?: TUint16
}

/** active A+ energy by tariffs T1-T4 */
export interface IEnergies extends Array<TInt32> {}

export interface IPackedEnergies {
    energyType?: TUint8,
    T1?: TUint32,
    T2?: TUint32,
    T3?: TUint32,
    T4?: TUint32
}

export const defaultFrameHeader: IFrameHeader = {
    type: DATA_REQUEST,
    destination: 0xffff,
    source: 0xfffe
};

export const TARIFF_PLAN_SIZE = 11;
export const OPERATOR_PARAMETERS_SIZE = 74;
export const SEASON_PROFILE_DAYS_NUMBER = 7;
export const SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;


const baseDisplaySetMask = {
    SET_ALL_SEGMENT_DISPLAY: 0x0001,
    SOFTWARE_VERSION: 0x0002,
    TOTAL_ACTIVE_ENERGY: 0x0004,
    ACTIVE_ENERGY_T1: 0x0008,
    ACTIVE_ENERGY_T2: 0x0010,
    ACTIVE_ENERGY_T3: 0x0020,
    ACTIVE_ENERGY_T4: 0x0040,
    ACTIVE_POWER_PER_PHASE: 0x0080,
    ACTIVE_POWER_IN_NEUTRAL: 0x0100,
    CURRENT_IN_PHASE: 0x0200,
    CURRENT_IN_NEUTRAL: 0x0400,
    VOLTAGE: 0x0800,
    HOUR_MINUTE_SECOND: 0x1000,
    DATE_MONTH_YEAR: 0x2000,
    TOTAL_EXPORTED_ACTIVE_ENERGY: 0x4000,
    EXPORTED_ACTIVE_ENERGY_T1: 0x8000,
    EXPORTED_ACTIVE_ENERGY_T2: 0x00010000,
    EXPORTED_ACTIVE_ENERGY_T3: 0x00020000,
    EXPORTED_ACTIVE_ENERGY_T4: 0x00040000,
    POWER_COEFFICIENT_PHASE_A: 0x00080000,
    POWER_COEFFICIENT_PHASE_B: 0x00100000,
    BATTERY_VOLTAGE: 0x00200000,
    POWER_THRESHOLD_T1: 0x00400000,
    POWER_THRESHOLD_T2: 0x00800000,
    POWER_THRESHOLD_T3: 0x01000000,
    POWER_THRESHOLD_T4: 0x02000000,
    CURRENT_BALANCE: 0x20000000
};

const displaySetMask = {
    ...baseDisplaySetMask,
    AUTO_SCREEN_SCROLLING: 0x80000000
};

const displaySetExtMask = {
    ...baseDisplaySetMask,
    MAGNET_INDUCTION: 0x08000000,
    OPTOPORT_SPEED: 0x40000000,
    SORT_DISPLAY_SCREENS: 0x80000000
};

const relaySet1Mask = {
    RELAY_ON_Y: 0x01,
    RELAY_ON_CENTER: 0x02,
    RELAY_ON_PB: 0x04,
    RELAY_ON_TARIFF_0: 0x08,
    RELAY_ON_TARIFF_1: 0x10,
    RELAY_ON_TARIFF_2: 0x20,
    RELAY_ON_TARIFF_3: 0x40,
    RELAY_ON_V_GOOD: 0x80
};

const relaySet2Mask = {
    RELAY_OFF_Y: 0x01,
    RELAY_OFF_CENTER: 0x02,
    RELAY_OFF_TARIFF_0: 0x04,
    RELAY_OFF_TARIFF_1: 0x08,
    RELAY_OFF_TARIFF_2: 0x10,
    RELAY_OFF_TARIFF_3: 0x20,
    RELAY_OFF_I_LIMIT: 0x40,
    RELAY_OFF_V_BAD: 0x80
};

const relaySet3Mask = {
    RELAY_OFF_LIM_TARIFF_0: 0x02,
    RELAY_OFF_LIM_TARIFF_1: 0x04,
    RELAY_OFF_LIM_TARIFF_2: 0x08,
    RELAY_OFF_LIM_TARIFF_3: 0x10,
    RELAY_OFF_PF_MIN: 0x20
};

const relaySet4Mask = {
    RELAY_ON_TIMEOUT: 0x01,
    RELAY_ON_SALDO: 0x02,
    RELAY_OFF_SALDO: 0x04,
    RELAY_OFF_SALDO_SOFT: 0x08,
    RELAY_OFF_MAGNET: 0x10,
    RELAY_ON_MAGNET_TIMEOUT: 0x20,
    RELAY_ON_MAGNET_AUTO: 0x40
};

const relaySet5Mask = {
    RELAY_OFF_UNEQUAL_CURRENT: 0x01,
    RELAY_ON_UNEQUAL_CURRENT: 0x02,
    RELAY_OFF_BIPOLAR_POWER: 0x04,
    RELAY_ON_BIPOLAR_POWER: 0x08
};

const define1Mask = {
    BLOCK_KEY_OPTOPORT: 0x02,
    MAGNET_SCREEN_CONST: 0x20
};

const tariffsMask = {
    T1: 0x10,
    T2: 0x20,
    T3: 0x40,
    T4: 0x80
};


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    constructor ( dataOrLength: Uint8Array | number | string ) {
        // force BE for all numbers
        super(dataOrLength, false);
    }

    getFrameHeader (): IFrameHeader {
        return {
            type: this.getUint8(),
            destination: this.getUint16(),
            source: this.getUint16()
        };
    }

    setFrameHeader ( {
        type = defaultFrameHeader.type,
        destination = defaultFrameHeader.destination,
        source = defaultFrameHeader.source
    }: IFrameHeader ) {
        this.setUint8(type);
        this.setUint16(destination);
        this.setUint16(source);
    }

    getDateTime (): IDateTime {
        return {
            isSummerTime: !!this.getUint8(),
            seconds: this.getUint8(),
            minutes: this.getUint8(),
            hours: this.getUint8(),
            day: this.getUint8(),
            date: this.getUint8(),
            month: this.getUint8(),
            year: this.getUint8()
        };
    }

    setDateTime ( dateTime: IDateTime ) {
        this.setUint8(dateTime.isSummerTime ? 1 : 0);
        this.setUint8(dateTime.seconds);
        this.setUint8(dateTime.minutes);
        this.setUint8(dateTime.hours);
        this.setUint8(dateTime.day || 0);
        this.setUint8(dateTime.date);
        this.setUint8(dateTime.month);
        this.setUint8(dateTime.year);
    }

    getDate (): IDate {
        return {
            year: this.getUint8(),
            month: this.getUint8(),
            date: this.getUint8()
        };
    }

    setDate ( date: IDate ) {
        this.setUint8(date.year);
        this.setUint8(date.month);
        this.setUint8(date.date);
    }

    getPackedDate (): IDate {
        const date0 = this.getUint8();
        const date1 = this.getUint8();

        return {
            year: (date0 >> 1),
            month: ((date0 << 3) & 0x0f) | (date1 >> 5),
            date: date1 & 0x1f
        };
    }

    setPackedDate ( date: IDate ) {
        this.setUint8((date.year << 1) | ((date.month >> 3) & 0x01));
        this.setUint8(((date.month << 5) & 0xe0) | (date.date & 0x1f));
    }

    getTariffPlan (): ITariffPlan {
        return {
            id: this.getUint32(),
            tariffSet: this.getUint8(),
            activateYear: this.getUint8(),
            activateMonth: this.getUint8(),
            activateDay: this.getUint8(),
            specialProfilesArraySize: this.getUint8(),
            seasonProfilesArraySize: this.getUint8(),
            dayProfilesArraySize: this.getUint8()
        };
    }

    setTariffPlan ( tariffPlan: ITariffPlan ) {
        this.setUint32(tariffPlan.id);
        this.setUint8(tariffPlan.tariffSet);
        this.setUint8(tariffPlan.activateYear);
        this.setUint8(tariffPlan.activateMonth);
        this.setUint8(tariffPlan.activateDay);
        this.setUint8(tariffPlan.specialProfilesArraySize);
        this.setUint8(tariffPlan.seasonProfilesArraySize);
        this.setUint8(tariffPlan.dayProfilesArraySize);
    }

    static getDefaultOperatorParameters (): IOperatorParameters {
        return {
            vpThreshold: 265000,
            vThreshold: 156000,
            ipThreshold: 120000,
            pmaxThreshold0: 31800,
            pmaxThreshold1: 31800,
            pmaxThreshold2: 31800,
            pmaxThreshold3: 31800,
            speedOptoPort: 0,
            tint: 30,
            calcPeriodDate: 1,
            timeoutDisplay: 127,
            timeoutScreen: 7,
            displaySet: (bitSet.toObject(displaySetMask, 0x80003184) as unknown) as IDisplaySetOperatorParameter,
            relaySet4: (bitSet.toObject(relaySet4Mask, 0) as unknown) as IRelaySet4OperatorParameter,
            relaySet3: (bitSet.toObject(relaySet3Mask, 0) as unknown) as IRelaySet3OperatorParameter,
            relaySet2: (bitSet.toObject(relaySet2Mask, 3) as unknown) as IRelaySet2OperatorParameter,
            relaySet1: (bitSet.toObject(relaySet1Mask, 3) as unknown) as IRelaySet1OperatorParameter,
            displayType: 0,
            ten: 0,
            timeoutRefresh: 240,
            deltaCorMin: 15,
            timeoutMagnetOff: 5,
            timeoutMagnetOn: 5,
            define1: (bitSet.toObject(define1Mask, 0) as unknown) as IDefine1OperatorParameter,
            timeoutRelayOn: 1,
            timeoutRelayKey: 0,
            timeoutRelayAuto: 5,
            timeoutBadVAVB: 5,
            freqMax: 55,
            freqMin: 45,
            phMin: 0,
            year: 0,
            month: 0,
            date: 0,
            energyDecimalPoint: 2,
            typeMeter: 0,
            timeoutIMax: 5,
            timeoutPMax: 5,
            timeoutCos: 5,
            pMaxDef: 1,
            displaySetExt: (bitSet.toObject(displaySetExtMask, 0x8383fff) as unknown) as IDisplaySetExtOperatorParameter,
            timeoutUneqCurrent: 5,
            timeoutBipolarPower: 5,
            relaySet5: (bitSet.toObject(relaySet5Mask, 0) as unknown) as IRelaySet5OperatorParameter,
            timeCorrectPeriod: 24,
            timeCorrectPassHalfhour: false
        };
    }

    getOperatorParameters (): IOperatorParameters {
        const operatorParameters = {
            vpThreshold: this.getUint32(),
            vThreshold: this.getUint32(),
            ipThreshold: this.getUint32(),
            pmaxThreshold0: this.getUint32(),
            pmaxThreshold1: this.getUint32(),
            pmaxThreshold2: this.getUint32(),
            pmaxThreshold3: this.getUint32(),
            speedOptoPort: this.getUint8(),
            tint: this.getUint8(),
            calcPeriodDate: this.getUint8(),
            timeoutDisplay: this.getUint8(),
            timeoutScreen: this.getUint8(),
            displaySet: (bitSet.toObject(displaySetMask, this.getUint32()) as unknown) as IDisplaySetOperatorParameter,
            relaySet4: (bitSet.toObject(relaySet4Mask, this.getUint8()) as unknown) as IRelaySet4OperatorParameter,
            relaySet3: (bitSet.toObject(relaySet3Mask, this.getUint8()) as unknown) as IRelaySet3OperatorParameter,
            relaySet2: (bitSet.toObject(relaySet2Mask, this.getUint8()) as unknown) as IRelaySet2OperatorParameter,
            relaySet1: (bitSet.toObject(relaySet1Mask, this.getUint8()) as unknown) as IRelaySet1OperatorParameter,
            displayType: this.getUint8(),
            ten: this.getUint8(),
            timeoutRefresh: this.getUint16(),
            deltaCorMin: this.getUint8(),
            timeoutMagnetOff: this.getUint8(),
            timeoutMagnetOn: this.getUint8(),
            define1: (bitSet.toObject(define1Mask, this.getUint8()) as unknown) as IDefine1OperatorParameter,
            timeoutRelayOn: this.getUint8(),
            timeoutRelayKey: this.getUint8(),
            timeoutRelayAuto: this.getUint8(),
            timeoutBadVAVB: this.getUint8(),
            freqMax: this.getUint8(),
            freqMin: this.getUint8(),
            phMin: this.getUint16(),
            year: this.getUint8(),
            month: this.getUint8(),
            date: this.getUint8(),
            energyDecimalPoint: this.getUint8(),
            typeMeter: this.getUint8(),
            timeoutIMax: this.getUint8(),
            timeoutPMax: this.getUint8(),
            timeoutCos: this.getUint8(),
            pMaxDef: this.getUint8(),
            displaySetExt: (bitSet.toObject(displaySetExtMask, this.getUint32()) as unknown) as IDisplaySetExtOperatorParameter,
            timeoutUneqCurrent: this.getUint8(),
            timeoutBipolarPower: this.getUint8(),
            relaySet5: (bitSet.toObject(relaySet5Mask, this.getUint8()) as unknown) as IRelaySet5OperatorParameter,
            timeCorrectPeriod: 0,
            timeCorrectPassHalfhour: false
        };

        const timeCorrectPeriod = this.getUint8();

        operatorParameters.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
        operatorParameters.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);

        return operatorParameters as IOperatorParameters;
    }

    setOperatorParameters ( operatorParameters: IOperatorParameters ) {
        const timeCorrectPeriod = operatorParameters.timeCorrectPeriod
            | (operatorParameters.timeCorrectPassHalfhour ? 0x80 : 0);

        this.setUint32(operatorParameters.vpThreshold);
        this.setUint32(operatorParameters.vThreshold);
        this.setUint32(operatorParameters.ipThreshold);
        this.setUint32(operatorParameters.pmaxThreshold0);
        this.setUint32(operatorParameters.pmaxThreshold1);
        this.setUint32(operatorParameters.pmaxThreshold2);
        this.setUint32(operatorParameters.pmaxThreshold3);
        this.setUint8(operatorParameters.speedOptoPort);
        this.setUint8(operatorParameters.tint);
        this.setUint8(operatorParameters.calcPeriodDate);
        this.setUint8(operatorParameters.timeoutDisplay);
        this.setUint8(operatorParameters.timeoutScreen);
        this.setUint32(bitSet.fromObject(displaySetMask, (operatorParameters.displaySet as unknown) as bitSet.TBooleanObject));
        this.setUint8(bitSet.fromObject(relaySet4Mask, (operatorParameters.relaySet4 as unknown) as bitSet.TBooleanObject));
        this.setUint8(bitSet.fromObject(relaySet3Mask, (operatorParameters.relaySet3 as unknown) as bitSet.TBooleanObject));
        this.setUint8(bitSet.fromObject(relaySet2Mask, (operatorParameters.relaySet2 as unknown) as bitSet.TBooleanObject));
        this.setUint8(bitSet.fromObject(relaySet1Mask, (operatorParameters.relaySet1 as unknown) as bitSet.TBooleanObject));
        this.setUint8(operatorParameters.displayType);
        this.setUint8(operatorParameters.ten);
        this.setUint16(operatorParameters.timeoutRefresh);
        this.setUint8(operatorParameters.deltaCorMin);
        this.setUint8(operatorParameters.timeoutMagnetOff);
        this.setUint8(operatorParameters.timeoutMagnetOn);
        this.setUint8(bitSet.fromObject(define1Mask, (operatorParameters.define1 as unknown) as bitSet.TBooleanObject));
        this.setUint8(operatorParameters.timeoutRelayOn);
        this.setUint8(operatorParameters.timeoutRelayKey);
        this.setUint8(operatorParameters.timeoutRelayAuto);
        this.setUint8(operatorParameters.timeoutBadVAVB);
        this.setUint8(operatorParameters.freqMax);
        this.setUint8(operatorParameters.freqMin);
        this.setUint16(operatorParameters.phMin);
        this.setUint8(operatorParameters.year);
        this.setUint8(operatorParameters.month);
        this.setUint8(operatorParameters.date);
        this.setUint8(operatorParameters.energyDecimalPoint);
        this.setUint8(operatorParameters.typeMeter);
        this.setUint8(operatorParameters.timeoutIMax);
        this.setUint8(operatorParameters.timeoutPMax);
        this.setUint8(operatorParameters.timeoutCos);
        this.setUint8(operatorParameters.pMaxDef);
        this.setUint32(bitSet.fromObject(displaySetExtMask, (operatorParameters.displaySetExt as unknown) as bitSet.TBooleanObject));
        this.setUint8(operatorParameters.timeoutUneqCurrent);
        this.setUint8(operatorParameters.timeoutBipolarPower);
        this.setUint8(bitSet.fromObject(relaySet5Mask, (operatorParameters.relaySet5 as unknown) as bitSet.TBooleanObject));
        this.setUint8(timeCorrectPeriod);
    }

    static getDayProfileFromByte ( value: number ): IDayProfile {
        return {
            tariff: bitSet.extractBits(value, 2, 1),
            isFirstHalfHour: !bitSet.extractBits(value, 1, 3),
            hour: bitSet.extractBits(value, 5, 4)
        };
    }

    static getByteFromDayProfile ( dayProfile: IDayProfile ): number {
        let value = 0;

        value = bitSet.fillBits(value, 2, 1, dayProfile.tariff);
        value = bitSet.fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
        value = bitSet.fillBits(value, 5, 4, dayProfile.hour);

        return value;
    }

    getDayProfile (): IDayProfile {
        return CommandBinaryBuffer.getDayProfileFromByte(this.getUint8());
    }

    setDayProfile ( dayProfile: IDayProfile ) {
        this.setUint8(CommandBinaryBuffer.getByteFromDayProfile(dayProfile));
    }

    static getDefaultSeasonProfile (): ISeasonProfile {
        return {
            month: 1,
            date: 1,
            dayIndexes: [0, 0, 0, 0, 0, 0, 0]
        };
    }

    getSeasonProfile (): ISeasonProfile {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndexes: Array.from(
                {length: SEASON_PROFILE_DAYS_NUMBER},
                () => this.getUint8()
            )
        };
    }

    setSeasonProfile ( seasonProfile: ISeasonProfile ) {
        this.setUint8(seasonProfile.month);
        this.setUint8(seasonProfile.date);
        seasonProfile.dayIndexes.forEach(value => this.setUint8(value));
    }

    getSpecialDay (): ISpecialDay {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndex: this.getUint8(),
            isPeriodic: this.getUint8() === 0
        };
    }

    setSpecialDay ( specialDay: ISpecialDay ) {
        this.setUint8(specialDay.month);
        this.setUint8(specialDay.date);
        this.setUint8(specialDay.dayIndex);
        this.setUint8(+!specialDay.isPeriodic);
    }

    // https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceId.md
    getDeviceId (): IDeviceId {
        const manufacturer = getHexFromBytes(this.getBytes(3), {separator: ''});
        const type = this.getUint8();
        const year = this.getUint8();
        const serial = getHexFromBytes(this.getBytes(3), {separator: ''});

        return {manufacturer, type, year, serial};
    }

    setDeviceId ( {manufacturer, type, year, serial}: IDeviceId ) {
        this.setBytes(getBytesFromHex(manufacturer));
        this.setUint8(type);
        this.setUint8(year);
        this.setBytes(getBytesFromHex(serial));
    }

    // https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceType.md
    getDeviceType (): IDeviceType {
        return DeviceType.fromBytes(this.getBytes(9));
    }

    setDeviceType ( deviceType: IDeviceType ) {
        this.setBytes(DeviceType.toBytes(deviceType));
    }

    static getDefaultTimeCorrectionParameters (): ITimeCorrectionParameters {
        return {
            monthTransitionSummer: 3,
            dateTransitionSummer: 0,
            hoursTransitionSummer: 3,
            hoursCorrectSummer: 1,
            monthTransitionWinter: 10,
            dateTransitionWinter: 0,
            hoursTransitionWinter: 4,
            hoursCorrectWinter: 1,
            isCorrectionNeeded: true
        };
    }

    getTimeCorrectionParameters (): ITimeCorrectionParameters {
        return {
            monthTransitionSummer: this.getUint8(),
            dateTransitionSummer: this.getUint8(),
            hoursTransitionSummer: this.getUint8(),
            hoursCorrectSummer: this.getUint8(),
            monthTransitionWinter: this.getUint8(),
            dateTransitionWinter: this.getUint8(),
            hoursTransitionWinter: this.getUint8(),
            hoursCorrectWinter: this.getUint8(),
            isCorrectionNeeded: this.getUint8() === 1
        };
    }

    setTimeCorrectionParameters ( parameters: ITimeCorrectionParameters ) {
        this.setUint8(parameters.monthTransitionSummer);
        this.setUint8(parameters.dateTransitionSummer);
        this.setUint8(parameters.hoursTransitionSummer);
        this.setUint8(parameters.hoursCorrectSummer);
        this.setUint8(parameters.monthTransitionWinter);
        this.setUint8(parameters.dateTransitionWinter);
        this.setUint8(parameters.hoursTransitionWinter);
        this.setUint8(parameters.hoursCorrectWinter);
        this.setUint8(+parameters.isCorrectionNeeded);
    }

    getSaldoParameters (): ISaldoParameters {
        return {
            coefficients: Array.from({length: 4}, () => this.getUint32()),
            decimalPointTariff: this.getUint8(),
            indicationThreshold: this.getInt32(),
            relayThreshold: this.getInt32(),
            mode: this.getUint8(),
            saldoOffTimeBegin: this.getUint8(),
            saldoOffTimeEnd: this.getUint8(),
            decimalPointIndication: this.getUint8(),
            powerThreshold: this.getUint32(),
            creditThreshold: this.getInt32()
        };
    }

    setSaldoParameters ( saldoParameters: ISaldoParameters ) {
        saldoParameters.coefficients.forEach(value => this.setUint32(value));
        this.setUint8(saldoParameters.decimalPointTariff);
        this.setInt32(saldoParameters.indicationThreshold);
        this.setInt32(saldoParameters.relayThreshold);
        this.setUint8(saldoParameters.mode);
        this.setUint8(saldoParameters.saldoOffTimeBegin);
        this.setUint8(saldoParameters.saldoOffTimeEnd);
        this.setUint8(saldoParameters.decimalPointIndication);
        this.setUint32(saldoParameters.powerThreshold);
        this.setInt32(saldoParameters.creditThreshold);
    }

    // eslint-disable-next-line class-methods-use-this
    private getEnergyPeriod ( period: number ): IEnergyPeriod {
        if ( period === 0xffff ) {
            return {
                tariff: undefined,
                energy: undefined
            };
        }

        return {
            tariff: ((period >> 14) & 0x03),
            energy: (period & 0x3fff)
        };
    }

    private setEnergyPeriod ( {tariff, energy}: IEnergyPeriod ) {
        if ( tariff !== undefined && energy !== undefined ) {
            this.setUint16((tariff << 14) | (energy & 0x3fff));
        } else {
            this.setUint16(0xffff);
        }
    }

    getEnergyPeriods ( periodsNumber:number ): Array<IEnergyPeriod> {
        const periods = Array.from({length: periodsNumber}, () => this.getUint16());

        return periods.map(period => this.getEnergyPeriod(period));
    }

    setEnergyPeriods ( periods: Array<IEnergyPeriod> ) {
        periods.forEach(period => this.setEnergyPeriod(period));
    }

    getEnergies (): IEnergies {
        return Array.from({length: 4}, () => this.getUint32());
    }

    setEnergies ( energies: IEnergies ) {
        energies.forEach(value => this.setUint32(value));
    }

    getPackedEnergies ( withEnergyType: boolean ): IPackedEnergies {
        const result = {} as IPackedEnergies;

        if ( withEnergyType ) {
            const byte = this.getUint8();
            const tariffMap = bitSet.toObject(tariffsMask, byte);
            result.energyType = bitSet.extractBits(byte, 4, 1);

            Object.keys(tariffMap).forEach(tariff => {
                if ( tariffMap[tariff] ) {
                    result[tariff as keyof IPackedEnergies] = this.getUint32();
                }
            });
        } else {
            result.T1 = this.getUint32();
            result.T2 = this.getUint32();
            result.T3 = this.getUint32();
            result.T4 = this.getUint32();
        }

        return result;
    }

    setPackedEnergies ( data: IPackedEnergies ) {
        if ( data.energyType ) {
            const tariffMap = {
                T1: !!data.T1,
                T2: !!data.T2,
                T3: !!data.T3,
                T4: !!data.T4
            };

            const byte = bitSet.fromObject(tariffsMask, tariffMap);

            bitSet.fillBits(byte, 4, 1, data.energyType);

            Object.keys(tariffMap).forEach(tariff => {
                if ( tariffMap[tariff as keyof typeof tariffMap] ) {
                    this.setUint32(data[tariff as keyof IPackedEnergies] as number);
                }
            });
        } else if ( data.T1 && data.T2 && data.T3 && data.T4 ) {
            this.setUint32(data.T1);
            this.setUint32(data.T1);
            this.setUint32(data.T1);
            this.setUint32(data.T1);
        } else {
            throw Error('bad parameters structure, cannot convert to bytes');
        }
    }
}


export default CommandBinaryBuffer;
