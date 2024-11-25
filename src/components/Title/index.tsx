import { TitleContainer } from "./styles"

interface TitleProps {
    content: string
}

export function Title ({content}: TitleProps) {
    return (
        <TitleContainer>
            <h1>{content}</h1>
        </TitleContainer>
    )
}

