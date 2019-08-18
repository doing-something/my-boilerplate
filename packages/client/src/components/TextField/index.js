import React, { memo, useReducer } from 'react';
import PropTypes from 'prop-types';
// styles
import {
    TextFieldWrap,
    TextFieldLabel,
    TextFieldInput,
    TextFieldFloating,
    TextFieldError,
} from './styles';
// constants
const ACTIVATE_FIELD = 'ACTIVATE_FIELD';
const DISABLE_FOCUS = 'DISABLE_FOCUS';
const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';

function reducer(state, { type, value }) {
    switch (type) {
        case ACTIVATE_FIELD:
            return { ...state, isLabelActive: true };
        case DISABLE_FOCUS:
            return { ...state, isLabelActive: false };
        case UPDATE_INPUT_VALUE:
            return { ...state, inputValue: value, isLabelActive: true };
        default:
            return state;
    }
}

const TextField = memo(
    ({
        title,
        name,
        type,
        placeholder,
        disabled,
        autoComplete,
        onChange,
        onBlur,
        required,
        error,
    }) => {
        const [state, dispatch] = useReducer(reducer, {
            inputValue: '',
            isLabelActive: false,
        });

        const activateField = () => {
            dispatch({ type: ACTIVATE_FIELD });
        };

        const handleChange = e => {
            e.persist();
            const { value } = e.target;
            dispatch({ type: UPDATE_INPUT_VALUE, value });
            e.preventDefault();
            onChange(e);
        };

        const handleBlur = e => {
            // if (e.target.value === '') {
            //     dispatch({ type: DISABLE_FOCUS });
            // }
            onBlur(e);
        };

        return (
            <TextFieldWrap>
                <TextFieldLabel>
                    <TextFieldFloating isActive={!!state.inputValue}>
                        {title || name}
                    </TextFieldFloating>
                    <TextFieldInput
                        id={name}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        autoComplete={autoComplete}
                        value={state.inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={activateField}
                        isLabelActive={!!state.inputValue}
                    />
                </TextFieldLabel>
                {error && <TextFieldError>{error}</TextFieldError>}
            </TextFieldWrap>
        );
    },
);

export default TextField;

TextField.prototype = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    autoComplete: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
};

TextField.defaultProps = {
    title: '',
    error: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    required: false,
    autoComplete: 'on',
    value: '',
    onChange: () => {},
    onBlur: () => {},
};
