import styled from "styled-components";

interface StyledButtonProps {
    variant: 'text' | 'icon'
}

export const StyledButton = styled.button<StyledButtonProps>`
    background-color: ${props => props.variant == 'text' ? props.theme['yellow-500'] : 'transparent'};
    border-radius: 5px;
    color: ${props => props.variant == 'text' ? props.theme['yellow-800'] :  props.theme['yellow-500'] };
    outline: none;
    border: none;
    height: max-content;
    padding: ${props => props.variant == 'text' ? '10.5px 20px' :  0 } ;
    font-weight: 700;
    cursor: pointer;
    transition: .2s background-color;

    &:hover {
        background-color: ${props => props.variant == 'text' ? props.theme['yellow-600'] : 'transparent'};
        color: ${props => props.variant == 'text' ? props.theme['yellow-800'] : props.theme['yellow-600']};
    }
`