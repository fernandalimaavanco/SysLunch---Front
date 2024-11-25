import styled from "styled-components";

export const CancelButton = styled.button`
    height: max-content;
    border: 0;
    background: ${props => props.theme['red-500']};
    cursor: pointer;
    color: ${props => props.theme.white};
    font-weight: bold;
    padding: 10.5px 20px;
    border-radius: 6px;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:hover {
        background: ${props => props.theme['red-700']};
        transition: background-color all 0.2s;
    }
`

export const ContainerButtonsActionTable = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`