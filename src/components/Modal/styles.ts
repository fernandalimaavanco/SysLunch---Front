import styled from "styled-components";
import * as Dialog from '@radix-ui/react-dialog';

export const Overlay = styled(Dialog.Overlay)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
`

export const Content = styled(Dialog.Content)`
    min-width: 32rem;
    border-radius: 6px;
    padding: 2.5rem 3rem;
    background: ${props => props.theme['gray-800']};

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media (max-width: 576px) {
        min-width: 90%;
        padding: 1.5rem 2rem;
    }

    form {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        > div {
            display: flex;
            flex-direction: column;
            gap: 6px;

            > p {
                font-size: 12px;
                color: ${props => props.theme['red-300']};
            }
        }

        input, select {
            border-radius: 6px;
            width: 100%;
            border: 0;
            background: ${props => props.theme['gray-900']};
            color: ${props => props.theme['gray-300']};
            padding: 1rem;

            &::placeholder {
                color: ${props => props.theme['gray-500']};
            }
        }

        select {
            -webkit-appearance: none;
            -moz-appearance: none;    
            appearance: none;  
            
            &::after {
                content: '▼';
                position: absolute;
                color: white;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
            }
        }
    }
`

export const CloseButton = styled(Dialog.Close)`
    position: absolute;
    background: transparent;
    border: 0;
    top: 1.5rem;
    right: 1.5rem;
    line-height: 0;
    cursor: pointer;
    color: ${props => props.theme['gray-500']};
`
export const ModalTitle = styled(Dialog.Title)`
    padding: 20px 0;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
`