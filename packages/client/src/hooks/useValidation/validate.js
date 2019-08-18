import { trimValue } from './utils';

const runValidate = (rules, value) =>
    rules.reduce(
        ([isSuccess, message], [isValid, errorMessage]) => {
            if (!isSuccess) return [false, message];

            if (Object.is(value, undefined) || !isValid(trimValue(value)))
                return [false, errorMessage];
            return [true, ''];
        },
        [true, ''],
    );

function validateField(fieldValue = '', rules = []) {
    const errors = runValidate(rules, fieldValue);

    if (!errors[0]) return errors[1];
    return null;
}

export default function validate(fieldValues, fieldConfigs) {
    return Object.keys(fieldConfigs).reduce((errors, fieldName) => {
        const fieldConfig = fieldConfigs[fieldName];
        const fieldValue = fieldValues[fieldName];
        errors[fieldName] = validateField(fieldValue, fieldConfig.rules);
        return errors;
    }, {});
}
