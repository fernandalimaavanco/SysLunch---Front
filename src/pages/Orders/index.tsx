import { ClipboardText, PencilSimpleLine, PlusCircle, Trash } from "phosphor-react";
import { ButtonContainer, FormGrup, StyledContainer, StyledSearchFormContainer } from "../../components/SearchContainer";
import { StandardButton } from "../../components/StandardButton";
import { Title } from "../../components/Title";
import { formatTimestamp } from "../../utils/fomatter";
import { StyledTable } from "../../components/Table/styles";
import * as Dialog from '@radix-ui/react-dialog';
import { NewOrderModal } from "./components/NewOrderModal";
import { useContextSelector } from "use-context-selector";
import { StyledDivButton } from "./styles";
import { Order, OrdersContext } from "../../contexts/OrdersContext";
import { OrderItemsContext } from "../../contexts/OrderItemsContext";
import { NewItemOrderModal } from "./components/ItemsOrderModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const searchOrderFormSchema = z.object({
    tableNumber: z.number().nullable(),
})

type SearchOrderInputs = z.infer<typeof searchOrderFormSchema>

export function Orders() {

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SearchOrderInputs>({
        resolver:
            zodResolver(searchOrderFormSchema),
        defaultValues: {
            tableNumber: null,
        }
    })

    const fetchOrders = useContextSelector(OrdersContext, (context) => {
        return context.fetchOrders
    })

    const deleteOrder = useContextSelector(OrdersContext, (context) => {
        return context.deleteOrder
    })

    const orders = useContextSelector(OrdersContext, (context) => {
        return context.orders
    })

    const orderModalOpen = useContextSelector(OrdersContext, (context) => {
        return context.orderModalOpen
    })

    const setOrderModalOpen = useContextSelector(OrdersContext, (context) => {
        return context.setOrderModalOpen
    })

    const setEditingOrder = useContextSelector(OrdersContext, (context) => {
        return context.setEditingOrder
    })

    const setActualOrder = useContextSelector(OrdersContext, (context) => {
        return context.setActualOrder
    })

    const setOrderItems = useContextSelector(OrderItemsContext, (context) => {
        return context.setOrderItems
    })


    async function handleFetchOrders(data: SearchOrderInputs) {

        const { tableNumber } = data

        await fetchOrders(tableNumber)
    }


    function handlePrepareEditingOrder(order: Order) {
        setEditingOrder(order)
        setOrderModalOpen(true)
    }

    function handlePrepareManagementOrderItems(order: Order) {
        setActualOrder(order)
        setOrderItems(order.items ? order.items : [])
    }

    async function handleDeleteOrder(orderId: number) {
        await deleteOrder(orderId)
    }

    return (
        <>
            <Title content="PEDIDOS" />

            <StyledContainer>
                <StyledSearchFormContainer>

                    <FormGrup>
                        <label htmlFor="tableNumber">Mesa</label>
                        <input type="number" placeholder="Número da Mesa" required {...register('tableNumber', { valueAsNumber: true })} />
                        {errors.tableNumber && <p>{errors.tableNumber.message}</p>}
                    </FormGrup>

                    <ButtonContainer>
                        <StandardButton type="button" onClick={handleSubmit(handleFetchOrders)} variant="text" disabled={isSubmitting}>
                            Pesquisar
                        </StandardButton>
                        <Dialog.Root open={orderModalOpen} onOpenChange={setOrderModalOpen}>
                            <Dialog.Trigger asChild>
                                <StandardButton onClick={() => setEditingOrder(null)} variant="icon">
                                    <PlusCircle size={34} />
                                </StandardButton>
                            </Dialog.Trigger>

                            <NewOrderModal />
                        </Dialog.Root>

                    </ButtonContainer>

                </StyledSearchFormContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Mesa</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Observações</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(order => {
                            return (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.tableNumber}</td>
                                    <td>{formatTimestamp(order.createdAt)}</td>
                                    <td>
                                        {order.items ? order.items.reduce((acc, item) => {
                                            return acc + (item.quantity * item.price)
                                        }, 0) : 0}
                                    </td>
                                    <td>{order.observations}</td>
                                    <td>
                                        <StyledDivButton>
                                            <Dialog.Root>
                                                <Dialog.Trigger asChild>
                                                    <StandardButton variant="icon" onClick={() => handlePrepareManagementOrderItems(order)} >
                                                        <ClipboardText size={26} />
                                                    </StandardButton>
                                                </Dialog.Trigger>

                                                <NewItemOrderModal />

                                            </Dialog.Root>

                                            <StandardButton variant="icon" onClick={() => handlePrepareEditingOrder(order)} >
                                                <PencilSimpleLine size={26} />
                                            </StandardButton>

                                            <StandardButton variant="icon" onClick={() => handleDeleteOrder(order.id)}>
                                                <Trash size={26} />
                                            </StandardButton>
                                        </StyledDivButton>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </StyledTable>
            </StyledContainer>
        </>
    )
}