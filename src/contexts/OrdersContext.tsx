import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext, useContextSelector } from "use-context-selector";
import { OrderItem } from "./OrderItemsContext";
import { AlertContext } from "./AlertContext";
import { HttpError } from "../components/Alert";

export interface Order {
    id: number
    items: OrderItem[]
    tableNumber: number
    observations: string
    createdAt: string
}

interface CreateUpdateOrderInput {
    tableNumber: number
    observations: string
}

interface OrdersContextType {
    orders: Order[]
    editingOrder: null | Order
    orderModalOpen: boolean
    actualOrder: null | Order
    setOrders: (orders: Order[]) => void
    fetchOrders: (query?: number | null) => Promise<void>
    createOrder: (data: CreateUpdateOrderInput) => Promise<void>
    updateOrder: (orderId: number, data: CreateUpdateOrderInput) => Promise<void>
    deleteOrder: (orderId: number) => Promise<void>
    setActualOrder: (orderId: null | Order) => void
    setEditingOrder: (data: null | Order) => void
    setOrderModalOpen: (open: boolean) => void
}

interface OrdersProviderProps {
    children: ReactNode
}

export const OrdersContext = createContext({} as OrdersContextType)

export function OrdersProvider({ children }: OrdersProviderProps) {

    const [orders, setOrders] = useState<Order[]>([])
    const [actualOrder, setActualOrder] = useState<null | Order>(null)
    const [editingOrder, setEditingOrder] = useState<null | Order>(null)
    const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false)

    const configAlert = useContextSelector(AlertContext, (context) => {
        return context.configAlert
    })

    const fetchOrders = useCallback(async (query?: number | null) => {
        try {

            const params: Record<string, string | number | undefined> = {};
            if (query !== null && query !== undefined) {
                params.q = query;
            }

            const response = await api.get('/orders', { params });

            if (response.status === 200) {
                setOrders(response.data)
                return
            }

            setOrders([])

        } catch (error: unknown) {
            setOrders([])
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Houve um erro ao deletar o pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    const createOrder = useCallback(async (data: CreateUpdateOrderInput) => {
        const { tableNumber, observations } = data;

        try {
            const response = await api.post('/orders', {
                tableNumber,
                observations,
            })

            if (response.status === 201) {
                setOrders(state => [response.data.order, ...state])
                configAlert({ message: 'Pedido criado com sucesso!', type: 'success' })
            }

        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Houve um erro ao criar o pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    const updateOrder = useCallback(async (orderId: number, data: CreateUpdateOrderInput) => {
        const { tableNumber, observations } = data;

        try {
            const response = await api.put(`/orders/${orderId}`, {
                tableNumber,
                observations,
            });

            if (response.status === 200) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, tableNumber, observations } : order
                    )
                )
                configAlert({ message: 'Pedido atualizado com sucesso!', type: 'success' })
            }
        } catch (error) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Houve um erro ao atualizar o pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    const deleteOrder = useCallback(async (orderId: number) => {
        try {
            const response = await api.delete(`/orders/${orderId}`);

            if (response.status === 200) {
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
                configAlert({ message: 'Pedido deletado com sucesso!', type: 'success' })
            }
        } catch (error) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Houve um erro ao deletar o pedido. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);


    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <OrdersContext.Provider value={{
            orders,
            editingOrder,
            orderModalOpen,
            actualOrder,
            setOrders,
            setActualOrder,
            fetchOrders,
            createOrder,
            updateOrder,
            deleteOrder,
            setEditingOrder,
            setOrderModalOpen
        }}>
            {children}
        </OrdersContext.Provider>
    )
}

