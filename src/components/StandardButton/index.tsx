import React, { forwardRef, ReactNode } from "react";
import { StyledButton } from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'text' | 'icon';
    children: ReactNode;
}

export const StandardButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant, type = 'button', ...props }, ref) => {
        return (
            <StyledButton ref={ref} variant={variant} type={type} {...props}>
                {children}
            </StyledButton>
        )
    }
)