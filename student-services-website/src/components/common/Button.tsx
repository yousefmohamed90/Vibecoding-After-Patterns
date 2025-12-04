import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'outline'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'md', variant = 'primary', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
    }

    return (
      <button
        ref={ref}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg font-medium transition-all duration-200 ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export default Button
