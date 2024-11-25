import { StyledContainer } from "../../components/SearchContainer";
import { Title } from "../../components/Title";
import { ItemCard } from "./components/ItemCard";
import { CardCreateNewItem, CardsContainer } from "./styles";
import plusCircle from './assets/plus-circle.svg'
import { useContextSelector } from "use-context-selector";
import { ItemsContext } from "../../contexts/ItemsContext";
import * as Dialog from '@radix-ui/react-dialog';
import { NewItemModal } from "./components/NewItemModal";

export function Menu() {

    const items = useContextSelector(ItemsContext, (context) => {
        return context.items
    })

    const itemModalOpen = useContextSelector(ItemsContext, (context) => {
        return context.itemModalOpen
    })

    const setItemModalOpen = useContextSelector(ItemsContext, (context) => {
        return context.setItemModalOpen
    })

    const setEditingItem = useContextSelector(ItemsContext, (context) => {
        return context.setEditingItem
    })

    return (
        <>
            <Title content="CARDÁPIO" />
            <StyledContainer>
                <CardsContainer>
                    {items.map(item => {
                        return <ItemCard key={item.id} item={item} />
                    })}

                    <Dialog.Root open={itemModalOpen} onOpenChange={setItemModalOpen}>
                        <CardCreateNewItem asChild>
                            <button onClick={() => setEditingItem(null)}>
                                <img src={plusCircle} />
                            </button>
                        </CardCreateNewItem>

                        <NewItemModal />

                    </Dialog.Root>
                </CardsContainer>
            </StyledContainer>
        </>
    )
}