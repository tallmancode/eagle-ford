import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FormBlockClient } from '@/lib/blocks/form-block/components/FormBlockClient'
import type { Form } from '@/payload-types'

const sendGTMEvent = vi.fn()
const push = vi.fn()

vi.mock('@next/third-parties/google', () => ({
  sendGTMEvent: (...args: unknown[]) => sendGTMEvent(...args),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const form: Form = {
  id: 'form-1',
  title: 'Contact Us',
  formLayout: 'singlePage',
  fields: [
    {
      blockType: 'text',
      name: 'fullName',
      label: 'Full Name',
      required: true,
    },
  ],
  submitButtonLabel: 'Submit',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  sendGTMEvent.mockClear()
  push.mockClear()
  document.documentElement.setAttribute('data-analytics', 'live')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  document.documentElement.removeAttribute('data-analytics')
})

describe('FormBlockClient GTM tracking', () => {
  it('fires a form_submit event after a successful submission', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({}),
      }),
    )

    render(createElement(FormBlockClient, { form }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith({
        event: 'form_submit',
        form_id: form.id,
        form_name: form.title,
      })
    })
  })

  it('does not fire form_submit outside live production', async () => {
    document.documentElement.removeAttribute('data-analytics')

    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(createElement(FormBlockClient, { form }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })
})
