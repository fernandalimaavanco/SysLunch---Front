import { PencilSimpleLine, PlusCircle, Trash } from "phosphor-react";
import { ButtonContainer, FormGrup, StyledContainer, StyledSearchFormContainer } from "../../components/SearchContainer";
import { StandardButton } from "../../components/StandardButton";
import { Title } from "../../components/Title";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../lib/axios";
import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { HttpError } from "../../components/Alert";
import { useContextSelector } from "use-context-selector";
import { AlertContext } from "../../contexts/AlertContext";
import { StyledTable } from "../../components/Table/styles";
import { NewUserModal } from "./newUserModal";
import { ButtonActionContainer } from "./styles";

export interface User {
    id: number
    email: string
    name: string
    password: string
    status: boolean
}

export const searchUserFormSchema = z.object({
    email: z.string().nullable(),
    name: z.string().nullable(),
    password: z.string().nullable(),
});

type SearchUserInputs = z.infer<typeof searchUserFormSchema>;

export function Users() {

    const configAlert = useContextSelector(AlertContext, (context) => context.configAlert);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SearchUserInputs>({
        resolver: zodResolver(searchUserFormSchema),
        defaultValues: {
            email: null,
            name: null,
            password: null,
        },
    });

    const [users, setUsers] = useState<User[]>([])
    const [userModalOpen, setUserModalOpen] = useState<boolean>(false)
    const [editingUser, setEditingUser] = useState<null | User>(null)

    const fetchUsers = useCallback(async (query?: string | null) => {
        try {
            const params: Record<string, string | number | undefined> = {};
            if (query) {
                params.q = query;
            }

            const response = await api.get('/users', { params });

            console.log(response.data)

            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            setUsers([]);
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao buscar os usuários. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }, []);

    async function handleFetchUsers(data: SearchUserInputs) {
        const { email } = data;
        await fetchUsers(email || null);
    }

    async function handleDeleteUser(userId: number) {
        await deleteUser(userId);
    }

    async function deleteUser(userId: number) {
        try {
            const response = await api.delete(`/users/${userId}`);

            if (response.status === 200) {
                setUsers((oldUsers) => oldUsers.filter((user) => user.id !== userId));
                configAlert({ message: 'Usuário deletado com sucesso!', type: 'success' });
            }
        } catch (error) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao excluir o usuário. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }

    function updateUserArrayAfterNewUser(user: User) {
        setUsers(prevUsers => [user, ...prevUsers])
    }

    function updateUserArrayAfterUpdateUser(updatedUser: User) {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id
                    ? updatedUser
                    : user
            )
        );
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <Title content="USUÁRIOS" />
            <StyledContainer>
                <StyledSearchFormContainer>
                    <FormGrup>
                        <label htmlFor="email">Email</label>
                        <input type="text" placeholder="Email do usuário" {...register('email')} />
                        {errors.email && <p>{errors.email.message}</p>}
                    </FormGrup>

                    <ButtonContainer>
                        <StandardButton
                            type="button"
                            variant="text"
                            disabled={isSubmitting}
                            onClick={handleSubmit(handleFetchUsers)}
                        >
                            Pesquisar
                        </StandardButton>

                        <Dialog.Root open={userModalOpen} onOpenChange={setUserModalOpen}>
                            <Dialog.Trigger asChild>
                                <StandardButton onClick={() => setEditingUser(null)} variant="icon">
                                    <PlusCircle size={34} />
                                </StandardButton>
                            </Dialog.Trigger>

                            <NewUserModal 
                                editingUser={editingUser} 
                                setUserModalOpen={setUserModalOpen} 
                                updateUserArrayAfterNewUser={updateUserArrayAfterNewUser}
                                updateUserArrayAfterUpdateUser={updateUserArrayAfterUpdateUser} />
                        </Dialog.Root>
                    </ButtonContainer>
                </StyledSearchFormContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.status ? 'Ativo' : 'Inativo'}</td>
                                    <td>
                                        <ButtonActionContainer>

                                            <StandardButton variant="icon" onClick={() => setEditingUser(user)}>
                                                <PencilSimpleLine size={26} />
                                            </StandardButton>

                                            <StandardButton
                                                variant="icon"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <Trash size={26} />
                                            </StandardButton>
                                        </ButtonActionContainer>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </StyledTable>
            </StyledContainer>
        </>
    );
}
