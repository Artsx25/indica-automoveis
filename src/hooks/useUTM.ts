// src/hooks/useUTM.ts
// Captures UTM parameters and persists in sessionStorage

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface UTMData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
}

const SESSION_KEY = 'indica_utm'

function parseUTM(search: string): UTMData {
  const params = new URLSearchParams(search)
  const data: UTMData = {}

  const keys: (keyof UTMData)[] = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid',
  ]

  for (const key of keys) {
    const value = params.get(key)
    if (value) data[key] = value
  }

  return data
}

export function useUTM(): UTMData {
  const location = useLocation()
  const [utm, setUtm] = useState<UTMData>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    const parsed = parseUTM(location.search)
    if (Object.keys(parsed).length > 0) {
      const merged = { ...utm, ...parsed }
      setUtm(merged)
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(merged))
      } catch {
        // sessionStorage might be unavailable
      }
    }
  }, [location.search]) // eslint-disable-line react-hooks/exhaustive-deps

  return utm
}

export function getStoredUTM(): UTMData {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}
