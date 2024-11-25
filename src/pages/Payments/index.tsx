import { Eye, Money, Trash } from "phosphor-react";
import { ButtonContainer, FormGrup, StyledContainer, StyledSearchFormContainer } from "../../components/SearchContainer";
import { StandardButton } from "../../components/StandardButton";
import { Title } from "../../components/Title";
import { formatTimestamp, priceFormatter } from "../../utils/fomatter";
import { StyledTable } from "../../components/Table/styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../lib/axios";
import { useCallback, useEffect, useState } from "react";
import { NewPaymentModal } from "./NewPaymentModal";
import { StyledDivButton } from "./styles";
import { ViewPaymentModal } from "./ViewPaymentModal";
import * as Dialog from "@radix-ui/react-dialog";
import { HttpError } from "../../components/Alert";
import { useContextSelector } from "use-context-selector";
import { AlertContext } from "../../contexts/AlertContext";

export interface Payment {
    id: number
    tableNumber: number
    date: string
    total: number
}

interface PaidItem {
    id: number
    name: string
    quantity: number
    total: number
}

export interface CompletePayment {
    id: number
    tableNumber: number
    total: number
    paidItems: PaidItem[]

}

export const searchPaymentFormSchema = z.object({
    tableNumber: z.number().nullable(),
})

type SearchPaymentInputs = z.infer<typeof searchPaymentFormSchema>


export function Payments() {

    const configAlert = useContextSelector(AlertContext, (context) => {
        return context.configAlert
    })

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SearchPaymentInputs>({
        resolver:
            zodResolver(searchPaymentFormSchema),
        defaultValues: {
            tableNumber: null,
        }
    })

    const [payments, setPayments] = useState<Payment[]>([])
    const [actualPayment, setActualPayment] = useState<CompletePayment | null>(null)

    const fetchPayments = useCallback(async (query?: number | null) => {

        try {

            const params: Record<string, string | number | undefined> = {};
            if (query !== null && query !== undefined) {
                params.q = query;
            }

            const response = await api.get('/payments', { params });

            if (response.status === 200) {
                setPayments(response.data)
            }

        } catch (error) {
            setPayments([])
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' })
            } else {
                configAlert({ message: 'Erro ao buscar os pagamentos. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, [])

    async function handleFetchPayments(data: SearchPaymentInputs) {

        const { tableNumber } = data

        await fetchPayments(tableNumber)
    }

    function updatePayments(payments: Payment[]) {
        setPayments(state => [...payments, ...state])
    }

    async function handleDeletePayment(paymentId: number) {
        await deletePayment(paymentId)
    }

    async function deletePayment(paymentId: number) {

        try {
            const response = await api.delete(`/payments/${paymentId}`)

            if (response.status === 200) {
                setPayments(oldPayments => oldPayments.filter(payment => payment.id != paymentId))
            }
        } catch (error) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao gerar pagamento. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }

    async function handleFetchPayentById(paymentId: number) {
        await fetchPaymentById(paymentId)
    }

    async function fetchPaymentById(paymentId: number) {

        try {
            const response = await api.get(`/payments/${paymentId}`)

            if (response.status === 200) {
                setActualPayment(response.data)
            }
        } catch (error) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao buscar os pagamentos. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }

    useEffect(() => {
        fetchPayments()
    }, [])

    return (
        <>
            <Title content="PAGAMENTOS" />
            <StyledContainer>

                <StyledSearchFormContainer>

                    <FormGrup>
                        <label htmlFor="tableNumber">Mesa</label>
                        <input type="number" placeholder="Número da Mesa" required {...register('tableNumber', { valueAsNumber: true })} />
                        {errors.tableNumber && <p>{errors.tableNumber.message}</p>}
                    </FormGrup>

                    <ButtonContainer>
                        <StandardButton type="button" variant="text" disabled={isSubmitting}
                            onClick={handleSubmit(handleFetchPayments)}>
                            Pesquisar
                        </StandardButton>

                        <Dialog.Root>
                            <Dialog.Trigger asChild>
                                <StandardButton variant="icon">
                                    <Money size={34} />
                                </StandardButton>
                            </Dialog.Trigger>

                            <NewPaymentModal updatePayments={updatePayments} />

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
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map(payment => {
                            return (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>{payment.tableNumber}</td>
                                    <td>{formatTimestamp(payment.date)}</td>
                                    <td>{priceFormatter.format(payment.total)}</td>
                                    <td>
                                        <StyledDivButton>
                                            <Dialog.Root>
                                                <Dialog.Trigger asChild>
                                                    <StandardButton variant="icon" onClick={() => handleFetchPayentById(payment.id)}>
                                                        <Eye size={26} />
                                                    </StandardButton>
                                                </Dialog.Trigger>

                                                <ViewPaymentModal actualPayment={actualPayment} />
                                            </Dialog.Root>

                                            <StandardButton variant="icon" onClick={() => handleDeletePayment(payment.id)}>
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