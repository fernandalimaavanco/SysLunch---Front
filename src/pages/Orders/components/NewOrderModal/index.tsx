import { z } from "zod"
import { Modal } from "../../../../components/Modal"
import { StandardButton } from "../../../../components/StandardButton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrdersContext } from "../../../../contexts/OrdersContext"
import { useContextSelector } from 'use-context-selector';
import { useEffect } from "react"
import { CancelButton } from "../../../Menu/components/NewItemModal/styles"
import { ButtonActionContainerModal } from "../../../../components/ButtonActionContainerModal"

export const newOrderFormSchema = z.object({
    tableNumber: z.number().nullable(),
    observations: z.string()
})

type NewOrderInputs = z.infer<typeof newOrderFormSchema>

export function NewOrderModal() {

    const createOrder = useContextSelector(OrdersContext, (context) => {
        return context.createOrder
    })

    const updateOrder = useContextSelector(OrdersContext, (context) => {
        return context.updateOrder
    })

    const editingOrder = useContextSelector(OrdersContext, (context) => {
        return context.editingOrder
    })

    const setOrderModalOpen = useContextSelector(OrdersContext, (context) => {
        return context.setOrderModalOpen
    })

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset
    } = useForm<NewOrderInputs>({
        resolver:
            zodResolver(newOrderFormSchema),
        defaultValues: {
            tableNumber: null,
            observations: ''
        }
    })

    useEffect(() => {

        if (editingOrder != null) {
            reset({ tableNumber: editingOrder.tableNumber, observations: editingOrder.observations })
            setOrderModalOpen(true)

            return
        }

        reset({
            tableNumber: null,
            observations: ''
        })

    }, [editingOrder, reset, setOrderModalOpen])

    async function handleCreateUpdateOrder(data: NewOrderInputs) {

        const { tableNumber, observations } = data

        if (tableNumber) {
            if (editingOrder) {
                await updateOrder(editingOrder.id, {
                    tableNumber,
                    observations
                })
            } else {
                await createOrder({
                    tableNumber,
                    observations
                })
            }

            reset({
                tableNumber: null,
                observations: ''
            })
            setOrderModalOpen(false)
        }
    }

    return (
        <Modal title="PEDIDO">
            <form onSubmit={handleSubmit(handleCreateUpdateOrder)}>
                <div>
                    <input type="text" placeholder="Número da Mesa" required {...register('tableNumber', { valueAsNumber: true })} />
                    {errors.tableNumber && <p>{errors.tableNumber.message}</p>}
                </div>

                <div>
                    <input type="text" placeholder="Observações" required {...register('observations')} />
                    {errors.observations && <p>{errors.observations.message}</p>}
                </div>

                <ButtonActionContainerModal>
                    {editingOrder && (<CancelButton>Cancelar</CancelButton>)}
                    <StandardButton type="submit" variant="text" disabled={isSubmitting}>
                        SALVAR
                    </StandardButton>
                </ButtonActionContainerModal>

            </form>
        </Modal >
    )
}