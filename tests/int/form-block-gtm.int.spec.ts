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
  form_name: 'general_enquiry',
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
  form_name: 'sell_your_car',
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
  it('fires enquiry_submitted when Payload returns 201 Created', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ doc: { id: 'sub-201' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(createElement(FormBlockClient, { form }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
      expect(sendGTMEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'enquiry_submitted',
          submission_id: 'sub-201',
        }),
      )
    })
  })

  it('fires enquiry_submitted after a successful submission', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
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
      ok: true,
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
        ok: true,
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
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
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

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 150)

    await waitFor(
      () => {
        expect(push).toHaveBeenCalledWith('/sales-form-submitted')
      },
      { timeout: 500 },
    )

    setTimeoutSpy.mockRestore()
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
        ok: true,
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

  it('fires enquiry_submitted with parts department for the parts form', async () => {
    const partsForm: Form = {
      ...form,
      id: 'form-parts',
      title: 'Parts Enquiry Form',
      form_name: 'parts',
      external_id: 'parts',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ doc: { id: 'sub-parts' } }),
      }),
    )

    render(createElement(FormBlockClient, { form: partsForm }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'enquiry_submitted',
          form_name: 'parts',
          form_id: 'parts',
          department: 'parts',
          submission_id: 'sub-parts',
        }),
      )
    })
  })

  it('warns and skips enquiry_submitted when form_name cannot be resolved', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ doc: { id: 'sub-unknown' } }),
      }),
    )

    const unknownForm = {
      ...form,
      title: 'Custom Dealer Form',
      form_name: null,
    } as unknown as Form

    render(createElement(FormBlockClient, { form: unknownForm }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(
        '[analytics] enquiry_submitted skipped: unresolved form',
        expect.objectContaining({
          formTitle: 'Custom Dealer Form',
        }),
      )
    })

    expect(sendGTMEvent).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('normalizes dot-format external_id to underscores in GTM payload', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ doc: { id: 'sub-dots' } }),
      }),
    )

    const dottedForm: Form = {
      ...form,
      form_name: 'new_vehicle_quote',
      external_id: 'new.vehicle.quote',
    }

    render(createElement(FormBlockClient, { form: dottedForm }))

    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'enquiry_submitted',
          form_name: 'new_vehicle_quote',
          form_id: 'new_vehicle_quote',
        }),
      )
    })

    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
