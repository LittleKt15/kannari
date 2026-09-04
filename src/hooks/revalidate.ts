import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
function refresh(context: Record<string, unknown>) {
  if (context.skipRevalidation) return
  revalidateTag('portfolio', { expire: 0 })
  revalidatePath('/', 'layout')
}
export const refreshContent: CollectionAfterChangeHook = ({ doc, previousDoc, context }) => {
  if (doc._status === 'published' || previousDoc?._status === 'published') refresh(context)
  return doc
}
export const refreshDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  refresh(context)
  return doc
}
export const refreshSettings: GlobalAfterChangeHook = ({ doc, context }) => {
  refresh(context)
  return doc
}
