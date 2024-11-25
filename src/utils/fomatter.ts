export const dateFormatter = new Intl.DateTimeFormat('pt-BR')

export function formatTimestamp(timestamp: string) {
  console.log(timestamp)
    const date = new Date(timestamp);
    return dateFormatter.format(date);
  }

export const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})