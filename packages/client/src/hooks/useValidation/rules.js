import * as R from 'ramda';

export const isMatchAnyOf = (...checkers) => value =>
    checkers.reduce((acc, f) => {
        if (acc) return acc;
        return f(value);
    }, false);

export const isEmpty = v => {
    return (
        v === undefined ||
        v === null ||
        (typeof v === 'object' && Object.keys(v).length === 0) ||
        (typeof v === 'string' && v.trim().length === 0)
    );
};

const isValidEmailFormat = v => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(v);
};
export const lengthNotBetween = R.curry(
    (min, max, v) => String(v).length < min || String(v).length > max,
);

const isNotValidEmailFormat = v => !isValidEmailFormat(v);
export const isDigitChar = v => String(v).search(/[^\d]/) === -1;
const isNotBeginWith = char => v => String(v).substr(0, 1) !== char;

export const isSameValueWith = R.curry((target, v, vs) => {
    if (!vs[target]) return false;
    return vs[target].value === v;
});

export const isDateTimeRange = v => {
    const { startDate, endDate, startTime, endTime } = v;

    return (
        startDate instanceof Date &&
        endDate instanceof Date &&
        typeof startTime === 'number' &&
        typeof endTime === 'number'
    );
};

export const isEmail = v => !isNotValidEmailFormat(v);
export const isRequired = v => !isEmpty(v);
export const isTrue = v => !!v;
export const isNumber = v => !Number.isNaN(Number(v));
export const hasCheckedValue = arr => arr.length;
export const isSameWith = R.curry((target, v) => target === v);
export const lengthBetween = R.curry(
    (min, max, v) => String(v).length >= min && String(v).length <= max,
);
export const isNotValidEmail = v => !isValidEmailFormat(v);
export const isPhoneNumber = v =>
    !isMatchAnyOf(lengthNotBetween(10, 12), isNotBeginWith('0'))(v);
