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
  title: 'General Enquiry Form',
  external_id: 'general_enquiry',
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

const multiStepForm: Form = {
  id: 'form-sell',
  title: 'Sell Enquiry Form',
  external_id: 'sell_your_car',
  formLayout: 'multiStep',
  steps: [
    {
      title: 'Vehicle details',
      fields: [
        {
          blockType: 'text',
          name: 'make',
          label: 'Make',
          required: true,
        },
      ],
    },
    {
      title: 'Contact details',
      fields: [
        {
          blockType: 'text',
          name: 'fullName',
          label: 'Full Name',
          required: true,
        },
      ],
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
  Element.prototype.scrollIntoView = vi.fn()
  document.documentElement.setAttribute('data-analytics', 'live')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.removeAttribute('data-analytics')
})

describe('FormBlockClient GTM tracking', () => {
  it('fires enquiry_submitted after a successful submission', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 201,
        json: async () => ({ doc: { id: 'sub-123' } }),
      }),
    )

    render(createElement(FormBlockClient, { form }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'enquiry_submitted',
          form_name: 'general_enquiry',
          form_id: 'general_enquiry',
          department: 'sales',
          submission_id: 'sub-123',
        }),
      )
    })

    expect(sendGTMEvent).toHaveBeenCalledTimes(1)
  })

  it('does not fire enquiry_submitted outside live production', async () => {
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

  it('does not fire GTM events when client validation fails', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(createElement(FormBlockClient, { form }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeTruthy()
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(sendGTMEvent).not.toHaveBeenCalled()
  })

  it('includes gclid on enquiry_submitted when attribution is present', async () => {
    localStorage.setItem(
      'eagle-ford:attribution',
      JSON.stringify({
        gclid: 'Cj0KCQjwTest',
        capturedAt: new Date().toISOString(),
      }),
    )

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 201,
        json: async () => ({ doc: { id: 'sub-gclid' } }),
      }),
    )

    render(createElement(FormBlockClient, { form }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'enquiry_submitted',
          gclid: 'Cj0KCQjwTest',
        }),
      )
    })

    expect(sendGTMEvent).toHaveBeenCalledTimes(1)
  })

  it('redirects known enquiry forms to the sales thank-you page after GTM defer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 201,
        json: async () => ({ doc: { id: 'sub-456' } }),
      }),
    )

    render(createElement(FormBlockClient, { form }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalled()
    })

    expect(push).not.toHaveBeenCalled()

    await waitFor(
      () => {
        expect(push).toHaveBeenCalledWith('/sales-form-submitted')
      },
      { timeout: 300 },
    )
  })

  it('does not fire enquiry_submitted when advancing a multi-step form', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(createElement(FormBlockClient, { form: multiStepForm }))

    fireEvent.change(screen.getByLabelText('Make *'), {
      target: { value: 'Ford' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Full Name *')).toBeTruthy()
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(sendGTMEvent).not.toHaveBeenCalled()
  })

  it('fires enquiry_submitted for Sell Enquiry Form on final multi-step submit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 201,
        json: async () => ({ doc: { id: 'sub-sell' } }),
      }),
    )

    render(createElement(FormBlockClient, { form: multiStepForm }))

    fireEvent.change(screen.getByLabelText('Make *'), {
      target: { value: 'Ford' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Full Name *')).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'enquiry_submitted',
          form_name: 'sell_your_car',
          form_id: 'sell_your_car',
          submission_id: 'sub-sell',
        }),
      )
    })

    expect(sendGTMEvent).toHaveBeenCalledTimes(1)
  })
})
