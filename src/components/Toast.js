import React, { useEffect, useState } from 'react'

export default function Toast({ text, option, dismissTime }) {
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (mounted) {
        setIsFading(true)
      }
    }, dismissTime - 500)

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className={`notification ${isFading ? 'fade-out ' : ''}${option}`}>
      {text}
    </div>
  )
}