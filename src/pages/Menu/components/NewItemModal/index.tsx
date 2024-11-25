import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CancelButton, CloseButton, Content, FileInputContainer, FileInputIcon, FileInputText, Overlay } from "./styles";
import { X } from "phosphor-react";
import { ItemsContext } from "../../../../contexts/ItemsContext";
import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { StandardButton } from "../../../../components/StandardButton";
import { ButtonActionContainerModal } from "../../../../components/ButtonActionContainerModal";

const newItemFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
        .max(60, { message: "Nome deve ter no máximo 60 caracteres" }),
    description: z
        .string()
        .min(3, { message: "Descrição deve ter pelo menos 3 caracteres" })
        .max(255, { message: "Descrição deve ter no máximo 255 caracteres" }),
    price: z
        .number()
        .refine(val => val !== null && val > 0, { message: "Preço deve ser maior que zero" }),
    active: z
        .number()
        .refine(val => val === 0 || val === 1, { message: "A situação deve ser ativo ou inativo." }),
    image: z
        .any()
        .refine(val => val === null || (val && val.size <= 5 * 1024 * 1024), {
            message: "A imagem deve ter no máximo 5MB",
        })
        .optional(),
});

type newItemFormInputs = z.infer<typeof newItemFormSchema>;

export function NewItemModal() {
    const editingItem = useContextSelector(ItemsContext, (context) => {
        return context.editingItem;
    });

    const createItem = useContextSelector(ItemsContext, (context) => {
        return context.createItem;
    });

    const updateItem = useContextSelector(ItemsContext, (context) => {
        return context.updateItem;
    });

    const setEditingItem = useContextSelector(ItemsContext, (context) => {
        return context.setEditingItem;
    });

    const setItemModalOpen = useContextSelector(ItemsContext, (context) => {
        return context.setItemModalOpen;
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        setValue,
    } = useForm<newItemFormInputs>({
        resolver: zodResolver(newItemFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: undefined,
            active: 1,
            image: null,
        },
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (editingItem != null) {
            reset({
                name: editingItem.name,
                description: editingItem.description,
                price: editingItem.price,
                active: editingItem.active ? 1 : 0,
                image: null,
            });

            if(editingItem.imagePath) {
                setImagePreview(editingItem.imagePath)
            }
    
            setItemModalOpen(true);

            const previewUrl = editingItem.image && typeof editingItem.image === 'string' ? editingItem.image : null;
            setImagePreview(previewUrl);

            return;
        }

        reset({
            name: '',
            description: '',
            price: undefined,
            active: 1,
            image: null,
        });
    }, [editingItem, reset, setItemModalOpen]);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setValue("image", file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    }

    async function handleCreateUpdateItems(data: newItemFormInputs) {
        const { name, description, price, active, image } = data;
        const booleanActive = active === 1 ? true : false;

        try {
            if (editingItem) {
                await updateItem(editingItem.id, { name, description, price, active: booleanActive, image });
            } else {
                await createItem({ name, description, price, active: booleanActive, image });
            }
        } catch (error) {
            console.error("Erro ao salvar o item:", error);
        }

        setEditingItem(null);
    }

    function handleCancelEdit() {
        setEditingItem(null);
    }

    return (
        <Dialog.Portal>
            <Overlay />
            <Content>
                <Dialog.Title>{editingItem ? "Editar item" : "Novo item"}</Dialog.Title>

                <CloseButton>
                    <X size={24} />
                </CloseButton>

                <form onSubmit={handleSubmit(handleCreateUpdateItems)}>
                    <div>
                        <input type="text" placeholder="Nome" required {...register("name")} />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>

                    <div>
                        <input type="text" placeholder="Descrição" required {...register("description")} />
                        {errors.description && <p>{errors.description.message}</p>}
                    </div>

                    <div>
                        <input type="number" placeholder="Preço" required {...register("price", { valueAsNumber: true })} />
                        {errors.price && <p>{errors.price.message}</p>}
                    </div>

                    <div>
                        <select {...register("active", { valueAsNumber: true })} required>
                            <option value={1}>Ativo</option>
                            <option value={0}>Inativo</option>
                        </select>
                        {errors.active && <p>{errors.active.message}</p>}
                    </div>

                    <FileInputContainer>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            onChange={handleImageChange}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload">
                            <FileInputIcon />
                            <FileInputText>Arraste ou clique para selecionar um arquivo</FileInputText>
                        </label>
                    </FileInputContainer>

                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px", maxHeight: "100px" }} />}

                    <ButtonActionContainerModal>
                        {editingItem && (
                            <CancelButton type="button" onClick={handleCancelEdit} disabled={isSubmitting}>
                                Cancelar
                            </CancelButton>
                        )}

                        <StandardButton variant="text" type="submit" disabled={isSubmitting}>
                            {editingItem ? "Salvar" : "Cadastrar"}
                        </StandardButton>
                    </ButtonActionContainerModal>
                </form>
            </Content>
        </Dialog.Portal>
    );
}
