import { Modal } from "../../../components/Modal"
import { StyledTable } from "../../../components/Table/styles"
import { SmileySad } from "phosphor-react"
import { StyledContainerWithoutOrder } from "../NewPaymentModal/styles"
import { CompletePayment } from "../index"
import { priceFormatter } from "../../../utils/fomatter"

interface ViewPaymentModalProps {
    actualPayment: CompletePayment | null
}

export function ViewPaymentModal({ actualPayment }: ViewPaymentModalProps) {

    const modalTitle = actualPayment ? `PAGAMENTO PEDIDO MESA - ${actualPayment.tableNumber}` : 'PAGAMENTO'

    return (

        <Modal title={modalTitle} >

            <StyledTable>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {actualPayment && actualPayment.paidItems && actualPayment.paidItems.length > 0 ? (
                        actualPayment.paidItems.map(item => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{priceFormatter.format(item.total)}</td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan={3}>
                                <StyledContainerWithoutOrder>
                                    <SmileySad size={48} />
                                    <p>Algo deu errado ao carregar os items do pedido pago!</p>
                                </StyledContainerWithoutOrder>
                            </td>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
        </Modal>
    )
}