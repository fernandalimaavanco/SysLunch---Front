import styled from "styled-components";

export const StyleContainer = styled.section`
    display: flex;
    flex-direction: column;
    padding: 60px 20px;
    height: 100%;

    h1 {
        font-size: 48px;
        text-align: center;
        margin-bottom: 45px;
    }

    img {
        margin-top: 2.5rem;
        width: auto;
        max-height: 350px;
    }
`

export const LegendContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
`

export const StyledLegend = styled.div`
    display: flex;
    gap: 10px;
    font-size: .85rem;
    align-items: center;

    > svg {
        color: ${props => props.theme['yellow-500']};
    }
`