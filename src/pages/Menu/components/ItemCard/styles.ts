import styled from "styled-components";

export const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: ${props => props.theme['white']};
    width: 310px;

    > div {
        padding: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;;

        p {
            color: ${props => props.theme['gray-900']};
            font-size: 15px;
            font-weight: 600;
        }
    }

    > img {
        width: 100%;
        height: 300px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
`

export const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: end;
    flex: 1;

    > button {
        background: transparent;
        border: none;
        outline: 0;
        cursor: pointer;

        &:hover {
            transform: scale(1.1);
        }
    }

`