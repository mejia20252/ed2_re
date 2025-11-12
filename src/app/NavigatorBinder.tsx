// src/app/NavigatorBinder.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigator } from './navigator'

export default function NavigatorBinder() {
  const navigate = useNavigate()
  useEffect(() => {
    setNavigator((path, opts) => navigate(path, { replace: opts?.replace }))
  }, [navigate])
  return null
}
