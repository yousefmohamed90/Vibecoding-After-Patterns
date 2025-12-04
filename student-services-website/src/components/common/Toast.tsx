import React from 'react'
export const Toast = ({ message }: any) => message ? <div className="fixed bottom-4 right-4 p-2 bg-black text-white">{message}</div> : null
export default Toast
