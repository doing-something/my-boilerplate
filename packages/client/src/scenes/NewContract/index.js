import React from 'react';
import { Link } from 'react-router-dom';
// apollo
import { useMutation } from '@apollo/react-hooks';
import { GET_CONTRACTS_QUERY, CREATE_CONTRACT } from 'queries';
// components
import TextField from 'components/TextField';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { Plus } from 'styled-icons/fa-solid';
// hooks
import useValidation, { isRequired, lengthBetween } from 'hooks/useValidation';
// styles
import { Header, Title, ButtonWrap } from './styles';

const configs = {
    title: {
        rules: [
            [isRequired, '제목을 입력하세요.'],
            [lengthBetween(1, 35), '1-35 자를 입력하세요.'],
        ],
    },
    description: {
        rules: [[isRequired, '내용을 입력하세요.']],
    },
};

const NewContract = props => {
    const [createContract, { loading, error }] = useMutation(CREATE_CONTRACT, {
        update: (cache, { data: { createContract } }) => {
            try {
                const { contracts } = cache.readQuery({
                    query: GET_CONTRACTS_QUERY,
                });

                cache.writeQuery({
                    query: GET_CONTRACTS_QUERY,
                    data: { contracts: contracts.concat([createContract]) },
                });
            } catch (err) {
                G.log('cache error: ', err);
            }
        },
    });

    const submitForm = async context => {
        await createContract({
            variables: {
                title: context.values['title'],
                description: context.values['description'],
            },
        })
            .then(() => {
                props.history.push('/contracts');
            })
            .catch(error => {
                G.log('Error: ', error.message);
            });
    };

    const { isSubmitted, getFieldProps, handleSubmit } = useValidation(
        configs,
        submitForm,
    );
    G.log('NewContract formState', error);

    return (
        <div className="wrap">
            <Header>
                <Title>CREATE NEW CONTRACT</Title>
                <ButtonWrap>
                    <Link to="/new">
                        <Button content={<Plus size="12" />} primary small />
                    </Link>
                </ButtonWrap>
            </Header>

            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    placeholder="Contract Title"
                    title="Contract Title"
                    {...getFieldProps('title')}
                />
                <br />
                <TextField
                    placeholder="Description"
                    title="description"
                    {...getFieldProps('description')}
                    multiLine
                />
                <br />
                <Button
                    type="submit"
                    content="Create Contract"
                    primary
                    block
                    loading={loading}
                    disabled={isSubmitted && !error}
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

export default NewContract;
