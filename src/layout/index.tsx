import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { MainContainer } from "./styles";
import Alert from "../components/Alert";
import { useContextSelector } from "use-context-selector";
import { AlertContext } from "../contexts/AlertContext";

export function Layout() {

    const alerts = useContextSelector(AlertContext, (context) => context.alerts);
    const removeAlert = useContextSelector(AlertContext, (context) => context.removeAlert);

    return (
        <>
            <Sidebar />
            <Alert alerts={alerts} onClose={removeAlert} />
            <MainContainer>
                <Outlet />
            </MainContainer>
        </>
    )
}