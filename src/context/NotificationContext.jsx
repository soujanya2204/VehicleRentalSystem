import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

const initial = [
  { id: 1, type: 'booking', title: 'New Booking', message: 'Alice Johnson booked Toyota Camry', time: '2 min ago', read: false },
  { id: 2, type: 'cancellation', title: 'Booking Cancelled', message: 'Bob Smith cancelled Honda Civic booking', time: '15 min ago', read: false },
  { id: 3, type: 'report', title: 'Problem Reported', message: 'Carol White reported an issue with Ford Explorer', time: '1 hr ago', read: false },
  { id: 4, type: 'kyc', title: 'KYC Submitted', message: 'David Lee submitted KYC documents', time: '3 hr ago', read: true },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initial)

  const markRead = (id) =>
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  const markAllRead = () =>
    setNotifications(n => n.map(x => ({ ...x, read: true })))

  const addNotification = (notif) =>
    setNotifications(n => [{ ...notif, id: Date.now(), read: false }, ...n])

  const unread = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, markRead, markAllRead, addNotification, unread }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
