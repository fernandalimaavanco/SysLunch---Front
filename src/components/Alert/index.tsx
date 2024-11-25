import { AlertContainer, CloseButton } from './styles';

interface AlertProps {
    alerts: {
        id: string;
        message: string;
        type: 'warning' | 'success' | 'danger' | null;
    }[];
    onClose: (id: string) => void;
}

export interface HttpError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export function Alert({ alerts, onClose }: AlertProps) {
    if (alerts.length === 0) return null;

    return (
        <>
            {alerts.map((alert) => (
                <AlertContainer key={alert.id} type={alert.type}>
                    <p>{alert.message}</p>
                    <CloseButton onClick={() => onClose(alert.id)}>×</CloseButton>
                </AlertContainer>
            ))}
        </>
    );
}

export default Alert;
