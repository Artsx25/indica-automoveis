// src/components/ui/Select.tsx
import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  ariaLabel?: string
  name?: string
}

export const Select: React.FC<SelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Selecione',
  disabled = false,
  className = '',
  ariaLabel,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const generatedId = useId()
  const triggerId = id || generatedId

  const selectedOption = options.find((opt) => String(opt.value) === String(value))
  const displayLabel = selectedOption ? selectedOption.label : placeholder

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((prev) => !prev)
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }

      const enabledOptions = options.filter((o) => !o.disabled)
      if (enabledOptions.length === 0) return

      const currentIndex = enabledOptions.findIndex((o) => String(o.value) === String(value))
      let nextIndex: number

      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1
      }

      onChange(String(enabledOptions[nextIndex].value))
    }
  }

  const handleSelectOption = (optValue: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return
    onChange(optValue)
    setIsOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isOpen ? styles.containerOpen : ''} ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        id={triggerId}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
      >
        <span className={`${styles.label} ${!selectedOption ? styles.placeholder : ''}`}>
          {displayLabel}
        </span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Hidden input for form submits if needed */}
      {name && <input type="hidden" name={name} value={value} />}

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className={styles.dropdown}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value)
            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectOption(String(opt.value), opt.disabled)}
                className={`
                  ${styles.option}
                  ${isSelected ? styles.optionSelected : ''}
                  ${opt.disabled ? styles.optionDisabled : ''}
                `}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={16} className={styles.optionCheck} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
