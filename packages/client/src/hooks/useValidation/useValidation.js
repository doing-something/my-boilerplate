import { useReducer } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import validate from './validate';
// constants
const UPDATE = 'UPDATE';
const VALIDATE = 'VALIDATE';
const BLUR = 'BLUR';
const SUBMIT = 'SUBMIT';

function reducer(state, { type, payload }) {
    switch (type) {
        case UPDATE:
            const values = { ...state.values, ...payload };

            return {
                ...state,
                values,
            };
        case VALIDATE:
            return { ...state, errors: payload };
        case BLUR:
            const blurred = { ...state.blurred, [payload]: true };
            return { ...state, blurred };
        case SUBMIT:
            return { ...state, isSubmitted: true };
        default:
            return state;
    }
}

const useForm = (config = {}, submitCallback) => {
    const [state, dispatch] = useReducer(reducer, getInitialState(config));
    if (typeof config === 'function') config = config(state.values);
    if (!config.fields) throw Error('invalid config');

    const errors = getErrors(state, config);
    const isFormValid = Object.values(errors).every(error => error === null);

    useDeepCompareEffect(() => {
        const errors = validate(state.values, config.fields);

        dispatch({ type: VALIDATE, payload: errors });
    }, [state.values, config.fields]);

    function getErrors(state, config) {
        if (config.showErrors === 'always') {
            return state.errors;
        }

        if (config.showErrors === 'blur') {
            return Object.entries(state.blurred)
                .filter(([, blurred]) => blurred)
                .reduce(
                    (acc, [name]) => ({ ...acc, [name]: state.errors[name] }),
                    {},
                );
        }
        return state.isSubmitted ? state.errors : {};
    }

    function getInitialState(config) {
        if (typeof config === 'function') {
            config = config({});
        }

        if (!config.fields) throw Error('invalid config');

        const initial = Object.keys(config.fields).reduce(
            ([initialValues, initialBlurred], fieldName) => {
                initialValues[fieldName] =
                    config.fields[fieldName].initialValue || '';
                initialBlurred[fieldName] = false;
                return [initialValues, initialBlurred];
            },
            [{}, {}],
        );

        const initialErrors = validate(initial[0], config.fields);
        return {
            values: initial[0],
            errors: initialErrors,
            blurred: initial[1],
            isSubmitted: false,
        };
    }

    function handleSubmit(event) {
        if (event) event.preventDefault();
        submitCallback && submitCallback({ values: state.values, isFormValid });
        dispatch({ type: SUBMIT });
    }

    function getFieldProps(fieldName) {
        return {
            onChange: e => {
                const { type, value } = e.target;

                if (!config.fields[fieldName]) return;

                dispatch({
                    type: UPDATE,
                    payload: {
                        [fieldName]:
                            type === 'checkbox' ? e.target.checked : value,
                    },
                });
            },
            onBlur: () => {
                dispatch({ type: BLUR, payload: fieldName });
            },
            name: fieldName,
            value: state.values[fieldName] || '',
            error: errors[fieldName],
            'aria-invalid': String(!!errors[fieldName]),
        };
    }

    return {
        isSubmitted: state.isSubmitted,
        isFormValid,
        handleSubmit,
        getFieldProps,
        errors,
    };
};

export default useForm;
