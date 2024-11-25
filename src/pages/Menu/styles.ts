import * as Dialog from "@radix-ui/react-dialog";
import styled from "styled-components";

export const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    padding: 30px 60px;
    justify-content: center;
`

export const CardCreateNewItem = styled(Dialog.Trigger)`
    display: flex;
    flex-wrap: wrap;
    min-height: 386px;
    gap: 30px;
    padding: 30px 60px;
    justify-content: center;
    cursor: pointer;
    width: 310px;
    align-items: center;

    > img {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
    }
`