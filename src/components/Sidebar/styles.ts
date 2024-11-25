import styled from "styled-components";

export const SidebarContainer = styled.aside`
    background: ${props => props.theme['gray-900']};
    height: 100vh;
    width: 200px;
    position: absolute;
    top: 0;
    left: 0;

    > div {
        padding-top: 60px;
        padding-bottom: 20px;
        display: grid;
        grid-template-rows: 15% 75% 10%;
        height: 100%;

        > a {
        text-align: center;
        }
    }
`
export const StyledNavigation = styled.nav`
    
    > ul {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    li {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding-left: 30px;

        > svg {
            color: ${props => props.theme['yellow-500']};
        }

        > a {
            text-decoration: none;
            color: ${props => props.theme['white']};
            font-weight: 700;
        }
    }
`

export const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: .5rem;
    align-self: end;
`