import { ReactNode, useCallback, useState } from "react"
import { createContext, useContextSelector } from "use-context-selector"
import { api } from "../lib/axios"
import { AlertContext } from "./AlertContext"
import { HttpError } from "../components/Alert"

export interface OrderItem {
    orderItemId: number
    itemId: number
    name: string
    quantity: number
    observation: string
    price: number
}

interface CreateUpdateOrderItemInput {
    itemId: number
    quantity: number
    observation: string
}

interface OrderItemsContextType {
    orderItems: OrderItem[]
    editingOrderItem: null | OrderItem
    fetchOrderItems: (orderId: number) => Promise<void>
    createOrderItem: (orderId: number, data: CreateUpdateOrderItemInput) => Promise<void>
    updateOrderItem: (orderId: number, data: CreateUpdateOrderItemInput) => Promise<void>
    deleteOrderItem: (orderItemId: number) => Promise<void>
    setOrderItems: (orderItems: OrderItem[]) => void
    setEditingOrderItem: (data: null | OrderItem) => void
}

interface OrderItemsProviderProps {
    children: ReactNode
}

export const OrderItemsContext = createContext({} as OrderItemsContextType)

export function OrderItemsProvider({ children }: OrderItemsProviderProps) {

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [editingOrderItem, setEditingOrderItem] = useState<null | OrderItem>(null)

    const configAlert = useContextSelector(AlertContext, (context) => {
        return context.configAlert
    })

    const fetchOrderItems = useCallback(async (orderId: number) => {
        try {
            const response = await api.get(`/orders/items/${orderId}`)

            if (response.status === 200) {
                setOrderItems(response.data)
            }

        } catch (error: unknown) {
            const httpError = error as HttpError
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' })
            } else {
                configAlert({ message: 'Erro ao buscar os itens do pedido. Tente novamente mais tarde.', type: 'danger' })
            }
        }
    }, []);

    const createOrderItem = useCallback(async (orderId: number, data: CreateUpdateOrderItemInput) => {
        try {
            const { itemId, quantity, observation } = data;

            const response = await api.post(`/orders/items/${orderId}`, {
                itemCode: itemId,
                quantity,
                observation
            })

            if (response.status === 201) {
                setOrderItems(state => [response.data.orderItem, ...state])
                configAlert({ message: 'Item incluído com sucesso!', type: 'success' })
            }

        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao criar o item do pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    const updateOrderItem = useCallback(async (orderItemId: number, data: CreateUpdateOrderItemInput) => {
        try {
            const { itemId, quantity, observation } = data;

            const response = await api.put(`/orders/items/${orderItemId}`, {
                itemCode: itemId,
                quantity,
                observation
            })

            if (response.status === 200) {
                setOrderItems(prevOrderItems =>
                    prevOrderItems.map(orderItem =>
                        orderItem.orderItemId === orderItemId ? {
                            ...orderItem,
                            itemId,
                            quantity,
                            observation,
                            price: response.data.orderItem.price,
                            name: response.data.orderItem.name,
                        } : orderItem
                    )
                )
                configAlert({ message: 'Item atualizado com sucesso!', type: 'success' })
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao atualizar o item do pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    const deleteOrderItem = useCallback(async (orderItemId: number) => {
        try {
            const response = await api.delete(`/orders/items/${orderItemId}`);

            if (response.status === 200) {
                setOrderItems(prevOrderItems => prevOrderItems.filter(orderItem => orderItem.orderItemId !== orderItemId))
                configAlert({ message: 'Item deletado com sucesso!', type: 'success' })
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' })
            } else {
                configAlert({ message: 'Erro ao deletar o item do pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);


    return (
        <OrderItemsContext.Provider value={{
            orderItems,
            editingOrderItem,
            // orderItemModalOpen,
            fetchOrderItems,
            createOrderItem,
            updateOrderItem,
            deleteOrderItem,
            setOrderItems,
            setEditingOrderItem,
            // setOrderItemModalOpen
        }}>
            {children}
        </OrderItemsContext.Provider>
    )
}

