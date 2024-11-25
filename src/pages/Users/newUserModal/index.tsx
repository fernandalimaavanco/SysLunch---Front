import { StandardButton } from "../../../components/StandardButton";
import { Modal } from "../../../components/Modal";
import { ButtonActionContainer } from "./styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../lib/axios";
import { HttpError } from "../../../components/Alert";
import { useContextSelector } from "use-context-selector";
import { AlertContext } from "../../../contexts/AlertContext";
import { User } from "..";
import { useEffect } from "react";

export const newUserFormSchema = z
    .object({
        name: z.string().min(1, "O nome é obrigatório."),
        email: z.string().email("E-mail inválido."),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
        confirmPassword: z.string().min(6, "A confirmação da senha deve ter pelo menos 6 caracteres."),
        status: z.number()
            .refine(val => val === 0 || val === 1, { message: "A situação deve ser ativo ou inativo." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
    });

type NewUserInputs = z.infer<typeof newUserFormSchema>;

interface NewUserModalProps {
    editingUser: User | null
    setUserModalOpen: (value: boolean) => void
    updateUserArrayAfterNewUser: (users: User) => void
    updateUserArrayAfterUpdateUser: (users: User) => void
}

export function NewUserModal({ editingUser, setUserModalOpen, updateUserArrayAfterNewUser, updateUserArrayAfterUpdateUser }: NewUserModalProps) {
    const configAlert = useContextSelector(AlertContext, (context) => context.configAlert);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset
    } = useForm<NewUserInputs>({
        resolver: zodResolver(newUserFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            status: 1,
        },
    });

    async function handleCreateUpdateUser(data: NewUserInputs) {

        console.log(editingUser)

        const { name, email, password, confirmPassword, status } = data

        if (editingUser) {
            await updateUser(editingUser.id, {
                name,
                email,
                password,
                confirmPassword,
                status
            })
        } else {
            await createUser({
                name,
                email,
                password,
                confirmPassword,
                status
            })
        }

        reset({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            status: 1,
        })
        setUserModalOpen(false)

    }

    async function createUser(data: NewUserInputs) {

        try {
            const response = await api.post("/users", {
                name: data.name,
                email: data.email,
                password: data.password,
                status: data.status,
            });

            if (response.status === 201) {
                configAlert({ message: "Usuário cadastrado com sucesso!", type: "success" });
                updateUserArrayAfterNewUser(response.data.user)
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: "danger" });
            } else {
                configAlert({ message: "Erro ao cadastrar o usuário. Tente novamente mais tarde.", type: "danger" });
            }
        }
    }

    async function updateUser(userId: number, data: NewUserInputs) {
        try {
            const response = await api.put(`/users/${userId}`, {
                name: data.name,
                email: data.email,
                password: data.password,
                status: data.status,
            });

            if (response.status === 200) {
                configAlert({ message: "Usuário alterado com sucesso!", type: "success" });
                updateUserArrayAfterUpdateUser(response.data.user)
            }
        } catch (error: unknown) {
            const httpError = error as HttpError;
            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: "danger" });
            } else {
                configAlert({ message: "Erro ao atualizar o usuário. Tente novamente mais tarde.", type: "danger" });
            }
        }
    }

    useEffect(() => {

        if (editingUser != null) {
            reset({
                name: editingUser.name,
                email: editingUser.email,
                password: editingUser.password,
                confirmPassword: editingUser.password,
                status: editingUser.status ? 1 : 0,
            })
            setUserModalOpen(true)

            return
        }

        reset({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            status: 1,
        })

    }, [editingUser, reset, setUserModalOpen])

    return (
        <Modal title="USUÁRIO">
            <form onSubmit={handleSubmit(handleCreateUpdateUser)}>
                <div>
                    <input type="text" placeholder="Nome" {...register("name")} />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div>
                    <input type="email" placeholder="E-mail" {...register("email")} />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div>
                    <input type="password" placeholder="Senha" {...register("password")} />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div>
                    <input type="password" placeholder="Confirme a senha" {...register("confirmPassword")} />
                    {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                </div>
                <div>
                    <select {...register("status", { valueAsNumber: true })}>
                        <option value={1}>Ativo</option>
                        <option value={0}>Inativo</option>
                    </select>
                    {errors.status && <p>{errors.status.message}</p>}
                </div>

                <ButtonActionContainer>
                    <StandardButton type="submit" variant="text" disabled={isSubmitting}>
                        SALVAR
                    </StandardButton>
                </ButtonActionContainer>
            </form>
        </Modal>
    );
}
