import React from "react"

export const highlightText = (text: string, highlight: string): React.ReactNode => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => {
        const regexMatch = new RegExp(`(${highlight})`, "gi")
        return regexMatch.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      })}
    </span>
  )
}

