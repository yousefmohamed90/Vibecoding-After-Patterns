import { useState } from 'react'
export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null)
  return { message, show: (m: string) => setMessage(m), clear: () => setMessage(null) }
}
