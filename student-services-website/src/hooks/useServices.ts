import { useContext } from 'react'
import { ServiceContext } from '../context/ServiceContext'

export const useServices = () => useContext(ServiceContext)
