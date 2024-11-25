import styled from "styled-components";

export const StyledForm = styled.div`
    display: grid !important;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: 10px;

    > div {
        flex: 1;
    }

    input {
        border-radius: 6px;
        width: 100%;
        border: 0;
        background: #1E1E1E;
        color: #DEDEDE;
        padding: 1rem;
    }
`
export const ButtonActionContainer = styled.div`
    display: flex;
    justify-content: end;
    margin-top: 10px;
`

export const StyledContainerWithoutOrder = styled.div`
    display: flex;
    margin: 20px;
    align-items: center;
    text-align: center; 
    flex-direction: column;
    gap: 10px;

    > p {
        color: ${props => props.theme['gray-300']};
    }
`