import styled from "styled-components";

export const MainContainer = styled.section`
    background: linear-gradient(to top, ${props => props.theme['gray-700']} 50%, ${props => props.theme['gray-800']} 50%);
    position: absolute;
    left: 200px;
    width: calc(100vw - 200px);
    height: 100vh;
    display: flex;
    flex-direction: column;
`