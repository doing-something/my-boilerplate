import React from 'react';
// apollo
import { useMutation } from '@apollo/react-hooks';
import { REGISTER_USER } from 'queries';
// components
import TextField from 'components/TextField';
import Button from 'components/Button';
import Modal from 'components/Modal';
// hooks
import useValidation, {
    isRequired,
    isEmail,
    isSameValueWith,
    lengthBetween,
} from 'hooks/useValidation';
// constants
const userNameError = '이름을 입력하세요.';
const emailNameError = 'email을 입력하세요.';
const passwordError = '비밀번호를 입력하세요.';
const passwordConfirmError = '비밀번호를 확인해주세요.';

const configs = {
    username: {
        rules: [[isRequired, userNameError]],
    },
    email: {
        rules: [
            [isRequired, emailNameError],
            [isEmail, '올바른 email 주소가 아닙니다.'],
        ],
    },
    password: {
        rules: [
            [isRequired, passwordError],
            [lengthBetween(8, 35), '8-35 자를 입력하세요.'],
        ],
    },
    passwordConfirm: {
        rules: [
            [isRequired, passwordConfirmError],
            [isSameValueWith('password'), passwordConfirmError],
        ],
    },
    // isAccepted: {
    //     default: false,
    //     rules: [[isTrue, '동의해주세요.']],
    // },
};

const Register = props => {
    const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

    const submitForm = () => {
        registerUser({
            variables: {
                name: formState['username'].value,
                email: formState['email'].value,
                password: formState['password'].value,
            },
        })
            .then(() => {
                props.history.push('/signin');
            })
            .catch(error => {
                G.log('Error: ', error.message);
            });
    };

    const {
        formState,
        isSubmitting,
        handleChange,
        handleSubmit,
    } = useValidation(configs, submitForm);
    G.log('Signup formState', error, formState);

    return (
        <div className="wrap">
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    placeholder="User Name (First + Last Name)"
                    title="User Name"
                    onChange={handleChange}
                    {...formState['username']}
                />
                <br />
                <TextField
                    placeholder="Email"
                    title="User Email"
                    onChange={handleChange}
                    {...formState['email']}
                />
                <br />
                <TextField
                    type="password"
                    placeholder="Password"
                    title="Password"
                    onChange={handleChange}
                    {...formState['password']}
                />
                <br />
                <TextField
                    type="password"
                    placeholder="Repeat Password"
                    title="Repeat password"
                    onChange={handleChange}
                    {...formState['passwordConfirm']}
                />
                <br />
                <Button
                    type="submit"
                    content={`Register`}
                    primary
                    block
                    loading={loading}
                    disabled={isSubmitting && !error}
                />
            </form>
            {error && (
                <Modal isVisible={!!error}>
                    <div className="text-center">{error && error.message}</div>
                </Modal>
            )}
        </div>
    );
};

export default Register;
