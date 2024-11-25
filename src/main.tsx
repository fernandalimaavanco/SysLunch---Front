import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { OrdersProvider } from './contexts/OrdersContext.tsx'
import { ItemsProvider } from './contexts/ItemsContext.tsx'
import { OrderItemsProvider } from './contexts/OrderItemsContext.tsx'
import { AlertProvider } from './contexts/AlertContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <AlertProvider>
      <AuthProvider>
        <OrdersProvider>
          <OrderItemsProvider>
            <ItemsProvider>
              <App />
            </ItemsProvider>
          </OrderItemsProvider>
        </OrdersProvider>
      </AuthProvider>
    </AlertProvider>

  </StrictMode >,
)
