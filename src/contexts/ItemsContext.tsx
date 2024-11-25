import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext, useContextSelector } from "use-context-selector";
import { HttpError } from "../components/Alert";
import { AlertContext } from "./AlertContext";

export interface Item {
    id: number
    name: string
    description: string
    price: number
    active: boolean
    image?: string | File | null
}

interface CreateUpdateItemInput {
    name: string
    description: string
    price: number
    active: boolean
    image?: File | null
}

interface ItemContexType {
    items: Item[]
    editingItem: null | { id: number, imagePath?: string | null} & CreateUpdateItemInput
    itemModalOpen: boolean,
    fetchItems: (query?: string) => Promise<void>
    createItem: (data: CreateUpdateItemInput) => Promise<void>
    updateItem: (itemId: number, data: CreateUpdateItemInput) => Promise<void>
    deleteItem: (itemId: number) => Promise<void>
    setEditingItem: (editingTransaction: null | { id: number } & CreateUpdateItemInput) => void
    setItemModalOpen: (open: boolean) => void
}

interface ItemsProviderProps {
    children: ReactNode
}

export const ItemsContext = createContext({} as ItemContexType)

export function ItemsProvider({ children }: ItemsProviderProps) {

    const [items, setItems] = useState<Item[]>([])
    const [editingItem, setEditingItem] = useState<null | { id: number } & CreateUpdateItemInput>(null)
    const [itemModalOpen, setItemModalOpen] = useState<boolean>(false)

    const configAlert = useContextSelector(AlertContext, (context) => {
        return context.configAlert
    })

    const fetchItems = useCallback(async (query?: string) => {
        try {
            const response = await api.get('/items', {
                params: {
                    q: query,
                },
            });

            console.log(response.data)

            if (response.status === 200) {
                setItems(response.data)
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' })
            } else {
                configAlert({ message: 'Erro ao buscar os itens. Tente novamente mais tarde.', type: 'danger' })
            }
        }
    }, [])

    const createItem = useCallback(async (data: CreateUpdateItemInput) => {
        try {
            const { name, description, price, active, image } = data;

            const formData = new FormData();

            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price.toString());
            formData.append('active', active.toString());

            if (image) {
                formData.append('image', image);
            }

            const response = await api.post('/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 201) {
                fetchItems()
                configAlert({ message: 'Item criado com sucesso!', type: 'success' });
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;

            console.log(error)
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao criar o item. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    const updateItem = useCallback(async (itemId: number, data: CreateUpdateItemInput) => {
        try {
            const { name, description, price, active, image } = data

            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price.toString())
            formData.append('active', active.toString())

            if (image) {
                formData.append('image', image);
            }

            const response = await api.put(`/items/${itemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                fetchItems()
                configAlert({ message: 'Item atualizado com sucesso!', type: 'success' });
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao atualizar o item. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);


    const deleteItem = useCallback(async (itemId: number) => {
        try {
            const response = await api.delete(`/items/${itemId}`)

            if (response.status === 200) {
                setItems(prevItems => prevItems.filter(item => item.id !== itemId))
                configAlert({ message: 'Item deletado com sucesso!', type: 'success' })
            }
        } catch (error: unknown) {
            const httpError = error as HttpError
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' })
            } else {
                configAlert({ message: 'Erro ao deletar o item. Tente novamente mais tarde.', type: 'danger' })
            }
        }
    }, [])


    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    return (
        <ItemsContext.Provider value={{
            items,
            editingItem,
            itemModalOpen,
            fetchItems,
            createItem,
            updateItem,
            deleteItem,
            setEditingItem,
            setItemModalOpen
        }}>
            {children}
        </ItemsContext.Provider>
    )
}

