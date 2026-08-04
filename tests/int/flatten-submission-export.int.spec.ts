import { describe, expect, it, vi } from 'vitest'

import {
  applyContactFieldsFromSubmissionData,
  denormalizeSubmissionContactFields,
} from '@/lib/form-submissions/contactFields'
import {
  flattenFormSubmissionExportBatch,
  flattenFormSubmissionForCsv,
  flattenFormSubmissionForJson,
  pivotSubmissionData,
  resolveFormExportLabel,
  type FormSubmissionExportDoc,
} from '@/lib/form-submissions/flattenSubmissionExport'

describe('pivotSubmissionData', () => {
  it('maps field/value pairs in submission order', () => {
    expect(
      pivotSubmissionData([
        { field: 'message', value: 'Hi' },
        { field: 'firstName', value: 'Ada' },
        { field: 'phone', value: '0821234567' },
      ]),
    ).toEqual({
      message: 'Hi',
      firstName: 'Ada',
      phone: '0821234567',
    })
  })

  it('keeps the first value when a field repeats', () => {
    expect(
      pivotSubmissionData([
        { field: 'email', value: 'a@example.com' },
        { field: 'email', value: 'b@example.com' },
      ]),
    ).toEqual({ email: 'a@example.com' })
  })

  it('handles empty or missing arrays', () => {
    expect(pivotSubmissionData(null)).toEqual({})
    expect(pivotSubmissionData(undefined)).toEqual({})
    expect(pivotSubmissionData([])).toEqual({})
  })
})

describe('resolveFormExportLabel', () => {
  it('prefers populated form title over id', () => {
    expect(resolveFormExportLabel({ id: 'abc', title: 'General Enquiry Form' })).toBe(
      'General Enquiry Form',
    )
  })

  it('falls back to id when title is missing', () => {
    expect(resolveFormExportLabel({ id: 'abc' })).toBe('abc')
    expect(resolveFormExportLabel('abc')).toBe('abc')
  })
})

describe('applyContactFieldsFromSubmissionData', () => {
  it('copies contact answers onto top-level fields', () => {
    const data = applyContactFieldsFromSubmissionData({
      submissionData: [
        { field: 'firstName', value: 'Ada' },
        { field: 'phone', value: '082' },
        { field: 'message', value: 'Hi' },
      ],
    })

    expect(data).toMatchObject({
      firstName: 'Ada',
      phone: '082',
    })
    expect(data).not.toHaveProperty('lastName')
    expect(data).not.toHaveProperty('message')
  })
})

describe('denormalizeSubmissionContactFields', () => {
  it('returns data with contact fields filled', async () => {
    const result = await denormalizeSubmissionContactFields({
      data: {
        submissionData: [{ field: 'email', value: 'a@example.com' }],
      },
    } as never)

    expect(result).toMatchObject({ email: 'a@example.com' })
  })
})

describe('flattenFormSubmissionForCsv', () => {
  const original: FormSubmissionExportDoc = {
    id: 'sub-1',
    form: { id: 'form-1', title: 'General Enquiry Form' },
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    motorCityLeadStatus: 'queued',
    submissionData: [
      { field: 'message', value: 'Need a quote' },
      { field: 'lastName', value: 'Lovelace' },
      { field: 'firstName', value: 'Ada' },
      { field: 'email', value: 'ada@example.com' },
      { field: 'phone', value: '0821234567' },
    ],
  }

  it('injects contact columns and strips indexed submissionData paths', () => {
    const row = flattenFormSubmissionForCsv(
      {
        id: 'sub-1',
        form: 'form-1',
        createdAt: '2026-08-01T10:00:00.000Z',
        submissionData_0_field: 'message',
        submissionData_0_value: 'Need a quote',
        submissionData_1_field: 'lastName',
        submissionData_1_value: 'Lovelace',
        motorCityLeadStatus: 'queued',
      },
      original,
    )

    expect(row).toMatchObject({
      id: 'sub-1',
      form: 'General Enquiry Form',
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '0821234567',
      email: 'ada@example.com',
      message: 'Need a quote',
      motorCityLeadStatus: 'queued',
    })
    expect(Object.keys(row).some((key) => key.startsWith('submissionData'))).toBe(false)
  })

  it('sets missing contact fields to null', () => {
    const row = flattenFormSubmissionForCsv(
      { id: 'sub-2' },
      {
        id: 'sub-2',
        submissionData: [{ field: 'firstName', value: 'Only' }],
      },
    )

    expect(row.firstName).toBe('Only')
    expect(row.lastName).toBeNull()
    expect(row.phone).toBeNull()
    expect(row.email).toBeNull()
  })

  it('falls back to denormalized contact fields when submissionData is absent', () => {
    const row = flattenFormSubmissionForCsv(
      { id: 'sub-3' },
      {
        id: 'sub-3',
        firstName: 'Stored',
        phone: '011',
      },
    )

    expect(row.firstName).toBe('Stored')
    expect(row.phone).toBe('011')
    expect(row.lastName).toBeNull()
  })

  it('orders contact columns before other answers', () => {
    const row = flattenFormSubmissionForCsv({ id: 'sub-1' }, original)
    const keys = Object.keys(row)
    expect(keys.indexOf('firstName')).toBeLessThan(keys.indexOf('message'))
    expect(keys.indexOf('email')).toBeLessThan(keys.indexOf('message'))
  })
})

describe('flattenFormSubmissionForJson', () => {
  it('replaces submissionData with answers and resolves form title', () => {
    const doc = flattenFormSubmissionForJson(
      {
        id: 'sub-1',
        form: 'form-1',
        submissionData: [{ field: 'phone', value: '082' }],
      },
      {
        id: 'sub-1',
        form: { id: 'form-1', title: 'Test Drive Form' },
        submissionData: [
          { field: 'firstName', value: 'Ada' },
          { field: 'phone', value: '0821234567' },
        ],
      },
    )

    expect(doc).toMatchObject({
      id: 'sub-1',
      form: 'Test Drive Form',
      firstName: 'Ada',
      phone: '0821234567',
      answers: {
        firstName: 'Ada',
        phone: '0821234567',
      },
    })
    expect(doc).not.toHaveProperty('submissionData')
  })
})

describe('flattenFormSubmissionExportBatch', () => {
  it('maps CSV and JSON batches from originalData', async () => {
    const original = {
      id: '1',
      form: { id: 'f1', title: 'Parts Enquiry Form' },
      submissionData: [
        { field: 'firstName', value: 'Sam' },
        { field: 'phone', value: '011' },
      ],
    }

    const csvRows = await flattenFormSubmissionExportBatch({
      batchNumber: 1,
      data: [{ id: '1', submissionData_0_field: 'firstName', submissionData_0_value: 'Sam' }],
      format: 'csv',
      originalData: [original],
      req: {} as never,
      totalBatches: 1,
    })

    expect(csvRows[0]).toMatchObject({
      form: 'Parts Enquiry Form',
      firstName: 'Sam',
      phone: '011',
    })
    expect(Object.keys(csvRows[0]!).some((key) => key.startsWith('submissionData'))).toBe(false)

    const jsonRows = await flattenFormSubmissionExportBatch({
      batchNumber: 1,
      data: [{ id: '1', submissionData: original.submissionData }],
      format: 'json',
      originalData: [original],
      req: {} as never,
      totalBatches: 1,
    })

    expect(jsonRows[0]).toMatchObject({
      form: 'Parts Enquiry Form',
      answers: { firstName: 'Sam', phone: '011' },
    })
  })

  it('re-fetches full docs when Fields select omitted submissionData', async () => {
    const find = vi.fn().mockResolvedValue({
      docs: [
        {
          id: '1',
          form: { id: 'f1', title: 'Service Booking Form' },
          submissionData: [
            { field: 'firstName', value: 'Pat' },
            { field: 'phone', value: '082999' },
            { field: 'email', value: 'pat@example.com' },
          ],
        },
      ],
    })

    const rows = await flattenFormSubmissionExportBatch({
      batchNumber: 1,
      data: [{ id: '1', firstName: null, createdAt: '2026-08-01T00:00:00.000Z' }],
      format: 'csv',
      originalData: [{ id: '1', firstName: null }],
      req: { payload: { find } } as never,
      totalBatches: 1,
    })

    expect(find).toHaveBeenCalledOnce()
    expect(rows[0]).toMatchObject({
      form: 'Service Booking Form',
      firstName: 'Pat',
      phone: '082999',
      email: 'pat@example.com',
    })
  })
})
