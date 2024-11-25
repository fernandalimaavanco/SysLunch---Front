import { ReactNode } from "react"
import * as Dialog from '@radix-ui/react-dialog';
import { CloseButton, Content, ModalTitle, Overlay } from "./styles";
import { X } from "phosphor-react";

interface ModalProps {
    children: ReactNode
    title: string
}

export function Modal({ children, title }: ModalProps) {
    return (
        <Dialog.Portal>
            <Overlay />
            <Content>
                <ModalTitle>
                    {title}
                </ModalTitle>
                <CloseButton>
                    <X size={24} />
                </CloseButton>
                {children}
            </Content>
        </Dialog.Portal >
    )
}