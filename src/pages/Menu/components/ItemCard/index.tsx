import { PencilSimpleLine } from "phosphor-react"
import { priceFormatter } from "../../../../utils/fomatter"
import { ButtonContainer, CardContainer } from "./styles"
import { useContextSelector } from "use-context-selector"
import { Item, ItemsContext } from "../../../../contexts/ItemsContext"
import { base64ToFile } from "../../../../utils/conversor"
import fallbackImage from "../../../../assets/fallback.png"

interface ItemCardProps {
    item: Item
}

export function ItemCard({ item }: ItemCardProps) {

    const setEditingItem = useContextSelector(ItemsContext, (context) => {
        return context.setEditingItem
    })

    function configEditItem(item: Item) {
        const base64String = item.image;
        const fileName = 'image.jpg';

        if (base64String) {
            const file = base64ToFile(base64String, fileName);

            const newItem = {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                active: item.active,
                image: file
            };

            setEditingItem(newItem)
        }
    }

    return (
        <CardContainer>
            <img src={item.image && typeof item.image === 'string' ? item.image : fallbackImage} />
            <div>
                <p>{item.name} - {priceFormatter.format(item.price)}</p>
                <ButtonContainer>
                    <button onClick={() => configEditItem(item)}>
                        <PencilSimpleLine size={22} />
                    </button>
                </ButtonContainer>
            </div>
        </CardContainer>
    )
}