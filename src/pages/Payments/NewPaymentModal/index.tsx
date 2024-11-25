import { StandardButton } from "../../../components/StandardButton"
import { MagnifyingGlass, SmileySad } from "phosphor-react"
import { Modal } from "../../../components/Modal"
import { ButtonActionContainer, StyledContainerWithoutOrder, StyledForm } from "./styles"
import { StyledTable } from "../../../components/Table/styles"
import { priceFormatter } from "../../../utils/fomatter"
import { useState } from "react"
import { Order } from "../../../contexts/OrdersContext"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "../../../lib/axios"
import { Payment } from ".."
import { HttpError } from "../../../components/Alert"
import { useContextSelector } from "use-context-selector"
import { AlertContext } from "../../../contexts/AlertContext"

export const newPaymentFormSchema = z.object({
    tableNumber: z.number().nullable(),
})

type NewPaymentInputs = z.infer<typeof newPaymentFormSchema>

interface NewPaymentModalProps {
    updatePayments: (payments: Payment[]) => void
}

export function NewPaymentModal({ updatePayments }: NewPaymentModalProps) {

    const [modalTitle, setModalTitle] = useState<string>("PAGAMENTO")
    const [orderForPayment, setOrderForPayment] = useState<Order | null>(null)

    const configAlert = useContextSelector(AlertContext, (context) => {
        return context.configAlert
    })

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<NewPaymentInputs>({
        resolver:
            zodResolver(newPaymentFormSchema),
        defaultValues: {
            tableNumber: null,
        }
    })

    async function createNewPayment() {

        try {
            if (orderForPayment) {
                const response = await api.post('/payments', {
                    orderId: orderForPayment.id
                })

                if (response.status == 201) {
                    configAlert({ message: 'Pagamento gerado com sucesso!', type: 'success' })
                    updatePayments(response.data.payment)
                }
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao gerar pagamento. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }

    async function handleCreatePayment() {

        if (orderForPayment) {
            await createNewPayment()
        }
    }

    async function fetchOrderByTableNumber(tableNumber: number) {

        try {
            const response = await api.get(`/orders/table/${tableNumber}`)

            if (response.status === 200) {
                setOrderForPayment(response.data)
                setModalTitle(`TOTALIZAÇÃO MESA - ${tableNumber}`)
                return
            }

            setModalTitle('PAGAMENTO')
            setOrderForPayment(null)
            configAlert({ message: response.data.message, type: 'danger' });
        } catch (error) {
            const httpError = error as HttpError
            setOrderForPayment(null)
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao buscar os pagamentos. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }

    async function handleFetchOrderByTableNumber(data: NewPaymentInputs) {
        const { tableNumber } = data

        if (tableNumber) {
            await fetchOrderByTableNumber(tableNumber)
        }
    }

    return (
        <Modal title={modalTitle}>

            <StyledForm>
                <div>
                    <input type="text" placeholder="Número da Mesa" required {...register('tableNumber', { valueAsNumber: true })} />
                    {errors.tableNumber && <p>{errors.tableNumber.message}</p>}
                </div>

                <div>
                    <StandardButton type="button" variant="icon" onClick={handleSubmit(handleFetchOrderByTableNumber)}>
                        <MagnifyingGlass size={28} />
                    </StandardButton>
                </div>
            </StyledForm>

            <StyledTable>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {orderForPayment && orderForPayment.items.length > 0 ? (
                        orderForPayment.items.map(item => {
                            return (
                                <tr key={item.orderItemId}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{priceFormatter.format(item.price)}</td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan={3}>
                                <StyledContainerWithoutOrder>
                                    <SmileySad size={48} />
                                    <p>Sem pedido selecionado</p>
                                </StyledContainerWithoutOrder>
                            </td>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <ButtonActionContainer>
                <StandardButton type="button" variant="text" disabled={isSubmitting} onClick={handleCreatePayment}>
                    CONFIRMAR PAGAMENTO
                </StandardButton>
            </ButtonActionContainer>
        </Modal>

    )
}