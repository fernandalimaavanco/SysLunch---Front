import styled from "styled-components";

export const StyledContainer = styled.section`
    margin: 0 30px 30px 30px;
    background-color: ${props => props.theme['gray-600']};
    padding: 30px;
    flex-grow: 1;
    border-radius: 5px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme['gray-800']} ${props => props.theme['gray-600']}; 

    &::-webkit-scrollbar {
        width: 12px;
        height: 12px;
    }

    &::-webkit-scrollbar-track {
        background-color: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #555; 
    }

    &::-webkit-scrollbar-button {
    display: none; 
}
`

export const StyledSearchFormContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    width: 100%;
    flex-wrap: wrap;
    align-items: end;
    row-gap: 20px;
    column-gap: 20px;

    input {
        border-radius: 6px;
        border: 0;
        background: ${props => props.theme['white']};
        color: ${props => props.theme['gray-600']};
        padding: 1rem;

        &::placeholder {
            color: ${props => props.theme['gray-600']};
        }
    }
`

export const FormGrup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`

export const ButtonContainer = styled.div`
    display: flex;
    gap: 1.5rem;
    justify-self: end;
`