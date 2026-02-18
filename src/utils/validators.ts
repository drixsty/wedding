export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/

export function validateEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  return phoneRegex.test(cleaned)
}

export function validateRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '')
}
