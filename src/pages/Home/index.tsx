import { ArrowLeft } from "phosphor-react";
import banner from './assets/banner.svg';
import { LegendContainer, StyleContainer, StyledLegend } from "./styles";

export function Home() {
    return (
        <StyleContainer>
            <h1>SEJA BEM VINDO AO SYSLUNCH</h1>

            <LegendContainer>
                <StyledLegend>
                    <ArrowLeft size={24} />
                    <p>Aqui você pode acompanhar, editar ou cancelar os pedidos com facilidade, garantindo que tudo saia como você deseja.</p>
                </StyledLegend>

                <StyledLegend>
                    <ArrowLeft size={24} />
                    <p>Aqui você pode gerenciar o seu cardápio, adicionando novos itens, editando ou removendo.</p>
                </StyledLegend>

                <StyledLegend>
                    <ArrowLeft size={24} />
                    <p>Controle e acompanhe todas as suas transações de maneira simples e clara, confira todos os pedidos finalizados e valores.</p>
                </StyledLegend>
            </LegendContainer>
            <img src={banner} />
        </StyleContainer>
    )
}