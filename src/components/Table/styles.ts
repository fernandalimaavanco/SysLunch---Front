import styled from "styled-components";

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem;

    th {
        border-bottom: 5px solid ${props => props.theme["gray-200"]};
        padding: 1.25rem 2rem;
        text-align: start;

        &:last-child {
           text-align: center;
        }
    }
    
    td {
        padding: 1.25rem 2rem;
        background: ${props => props.theme["gray-700"]};

        &:first-child {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
        }

        &:last-child {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
        }
    }
`