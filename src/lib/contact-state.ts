export type ContactState = {
  error: boolean
  text: string
  attempt: string
  values: Record<string, string>
} | null
