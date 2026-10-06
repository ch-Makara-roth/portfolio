import { toast, toastStore } from '@/components/ui/toast'

describe('Toast notification system', () => {
  beforeEach(() => {
    toast.dismiss()
  })

  test('adds a success toast to the store and notifies subscribers', () => {
    const listener = jest.fn()
    const unsubscribe = toastStore.subscribe(listener)

    toast.success('Your comment has been submitted and is awaiting AI moderation. It will appear live automatically!')

    expect(listener).toHaveBeenCalled()
    const latestToasts = listener.mock.calls[listener.mock.calls.length - 1][0]
    expect(latestToasts).toHaveLength(1)
    expect(latestToasts[0].type).toBe('success')
    expect(latestToasts[0].message).toBe(
      'Your comment has been submitted and is awaiting AI moderation. It will appear live automatically!'
    )

    unsubscribe()
  })

  test('dismisses a toast by id or all toasts', () => {
    const id = toast.error('Something went wrong')
    let currentToasts: any[] = []
    const unsubscribe = toastStore.subscribe((toasts) => {
      currentToasts = toasts
    })

    expect(currentToasts).toHaveLength(1)
    toast.dismiss(id)
    expect(currentToasts).toHaveLength(0)

    unsubscribe()
  })
})
