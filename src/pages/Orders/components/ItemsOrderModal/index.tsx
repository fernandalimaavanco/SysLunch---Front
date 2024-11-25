import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useContextSelector } from "use-context-selector";
import { StandardButton } from "../../../../components/StandardButton";
import { ButtonActionContainerModal } from "../../../../components/ButtonActionContainerModal";
import { OrderItemsContext } from "../../../../contexts/OrderItemsContext";
import { CancelButton, ContainerButtonsActionTable } from "./styles";
import { OrdersContext } from "../../../../contexts/OrdersContext";
import { Modal } from "../../../../components/Modal";
import { StyledTable } from "../../../../components/Table/styles";
import { PencilSimpleLine, Trash } from "phosphor-react";
import { priceFormatter } from "../../../../utils/fomatter";

const newItemOrderFormSchema = z.object({
    itemId: z
        .number()
        .nullable()
        .refine(val => val !== null && val > 0, { message: "O código do item deve ser maior que zero" }),
    quantity: z
        .number()
        .nullable()
        .refine(val => val !== null && val > 0, { message: "A quantidade deve ser maior que zero" }),
    observation: z
        .string()
        .max(255, { message: "Observações deve ter no máximo 255 caracteres" }),
})

type newItemOrderFormInputs = z.infer<typeof newItemOrderFormSchema>

export function NewItemOrderModal() {

    const orderItems = useContextSelector(OrderItemsContext, (context) => {
        return context.orderItems
    })

    const editingOrderItem = useContextSelector(OrderItemsContext, (context) => {
        return context.editingOrderItem
    })

    const createOrderItem = useContextSelector(OrderItemsContext, (context) => {
        return context.createOrderItem
    })

    const updateOrderItem = useContextSelector(OrderItemsContext, (context) => {
        return context.updateOrderItem
    })

    const setEditingOrderItem = useContextSelector(OrderItemsContext, (context) => {
        return context.setEditingOrderItem
    })

    const deleteOrderItem = useContextSelector(OrderItemsContext, (context) => {
        return context.deleteOrderItem
    })

    const actualOrder = useContextSelector(OrdersContext, (context) => {
        return context.actualOrder
    })

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset
    } = useForm<newItemOrderFormInputs>({
        resolver:
            zodResolver(newItemOrderFormSchema),
        defaultValues: {
            itemId: null,
            quantity: null,
            observation: '',
        }
    })

    useEffect(() => {

        if (editingOrderItem != null) {
            reset({ itemId: editingOrderItem.itemId, quantity: editingOrderItem.quantity, observation: editingOrderItem.observation })

            return
        }

        reset({
            itemId: null,
            quantity: null,
            observation: ''
        })

    }, [editingOrderItem, reset])

    async function handleCreateUpdateOrderItem(data: newItemOrderFormInputs) {

        const { itemId, quantity, observation } = data

        if (itemId && quantity && actualOrder) {
            if (editingOrderItem) {
                await updateOrderItem(editingOrderItem.orderItemId, {
                    itemId,
                    quantity,
                    observation
                })
            } else {
                await createOrderItem(actualOrder.id, {
                    itemId,
                    quantity,
                    observation
                })
            }
        }

        setEditingOrderItem(null)
    }

    function handleCancelEdit() {
        setEditingOrderItem(null)
    }

    async function handleDeleteOrderItem(orderItemId: number) {
        await deleteOrderItem(orderItemId)
    }

    const modalTitle = `ITENS PEDIDO MESA - ${actualOrder?.tableNumber}`

    return (
        <Modal title={modalTitle}>
            <form onSubmit={handleSubmit(handleCreateUpdateOrderItem)}>

                <div>
                    <input type="text" placeholder='Código Item' required {...register('itemId', { valueAsNumber: true })} />
                    {errors.itemId && <p>{errors.itemId.message}</p>}
                </div>

                <div>
                    <input type="text" placeholder='Quantidade' required {...register('quantity', { valueAsNumber: true })} />
                    {errors.quantity && <p>{errors.quantity.message}</p>}
                </div>

                <div>
                    <input type="text" placeholder='Observações' {...register('observation')} />
                    {errors.observation && <p>{errors.observation.message}</p>}
                </div>

                <ButtonActionContainerModal>
                    {editingOrderItem && (
                        <CancelButton type='button' onClick={handleCancelEdit} disabled={isSubmitting}>Cancelar</CancelButton>
                    )}

                    <StandardButton variant="text" type='submit' disabled={isSubmitting}>Salvar</StandardButton>
                </ButtonActionContainerModal>
            </form>

            <StyledTable>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantidade</th>
                        <th>Valor</th>
                        <th>Observações</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {orderItems.map((item) =>
                    (
                        <tr key={item.orderItemId}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{priceFormatter.format(item.price)}</td>
                            <td>{item.observation}</td>
                            <td>
                                <ContainerButtonsActionTable>
                                    <StandardButton variant="icon" onClick={() => setEditingOrderItem(item)}>
                                        <PencilSimpleLine size={22} />
                                    </StandardButton>

                                    <StandardButton variant="icon" onClick={() => handleDeleteOrderItem(item.orderItemId)}>
                                        <Trash size={22} />
                                    </StandardButton>
                                </ContainerButtonsActionTable>
                            </td>
                        </tr>
                    )
                    )}
                </tbody>
            </StyledTable>
        </Modal >
    )
}