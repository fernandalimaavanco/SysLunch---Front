import { ReactNode, useState } from "react"
import { createContext } from "use-context-selector"
import { v4 as uuidv4 } from 'uuid'

interface Alert {
    id: string
    message: string
    type: 'warning' | 'success' | 'danger' | null;
}

interface AlertContextType {
    alerts: Alert[];
    configAlert: (alert: Omit<Alert, 'id'>) => void
    removeAlert: (id: string) => void;
}

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertContext = createContext({} as AlertContextType);

export function AlertProvider({ children }: AlertProviderProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    function configAlert(alert: Omit<Alert, 'id'>) {
        const newAlert = { ...alert, id: uuidv4() };
        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

        setTimeout(() => {
            removeAlert(newAlert.id);
        }, 5000);
    }

    function removeAlert(id: string) {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }

    return (
        <AlertContext.Provider value={{ alerts, configAlert, removeAlert }}>
            {children}
        </AlertContext.Provider>
    );
}
