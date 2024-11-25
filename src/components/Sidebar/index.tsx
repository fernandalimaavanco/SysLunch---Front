import { FooterContainer, SidebarContainer, StyledNavigation } from "./styles";
import logo from '../../assets/SysLunch.svg'
import { CallBell, BookOpenText, Money } from '@phosphor-icons/react'
import { Link } from "react-router-dom";
import { Person } from "phosphor-react";

export function Sidebar() {
    return (
        <SidebarContainer>
            <div>
                <Link to="/home">
                    <img src={logo} />
                </Link>

                <StyledNavigation>
                    <ul>
                        <li>
                            <CallBell size={26} />
                            <Link to="/orders">Pedidos</Link>
                        </li>
                        <li>
                            <BookOpenText size={26} />
                            <Link to="/menu">Cardápio</Link>
                        </li>
                        <li>
                            <Money size={26} />
                            <Link to="/payments">Pagamento</Link>
                        </li>
                        <li>
                            <Person size={26} />
                            <Link to="/users">Usuários</Link>
                        </li>
                    </ul>
                </StyledNavigation>

                <FooterContainer>
                    <p>SysLunch ©</p>
                    <p>Direitos Reservados</p>
                </FooterContainer>
            </div>
        </SidebarContainer>
    )
}