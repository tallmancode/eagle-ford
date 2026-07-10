'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { Form, Page } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'
import { buildInitialFormState } from '@/lib/blocks/form-block/components/buildInitialFormState'
import { formFields } from '@/lib/blocks/form-block/components/fields'
import { MessageField } from '@/lib/blocks/form-block/components/fields/MessageField'
import { FormStepProgress } from '@/lib/blocks/form-block/components/FormStepProgress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/lib/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { buildFormSubmissionRequest } from '@/lib/blocks/form-block/utils/buildFormSubmission'
import { partitionFieldsForHeroLayout } from '@/lib/blocks/form-block/utils/formHeroLayout'
import {
  getFieldLayoutClassName,
  resolveFieldWidth,
} from '@/lib/blocks/form-block/utils/fieldWidth'
import {
  getFormSteps,
  getStepInputNames,
  isMultiStepForm,
  type FormInputField,
} from '@/lib/blocks/form-block/utils/getFormSteps'
import type { FormBlockContextValues } from '@/lib/blocks/form-block/types/formContext'
import {
  getHiddenFieldNames,
  mergeFormDefaultValues,
} from '@/lib/blocks/form-block/types/formContext'

export type FormBlockLayout = 'default' | 'hero'

export type FormBlockClientProps = {
  contextValues?: FormBlockContextValues
  enableIntro?: boolean | null
  form: Form
  introContent?: SerializedEditorState | null
  layout?: FormBlockLayout
}

type FormData = Record<string, unknown>

type SubmissionError = {
  message: string
  status?: number
}

const heroFormFieldClassName =
  '[&_label]:text-sm [&_label]:font-normal [&_label]:text-dark-400 [&_input]:!rounded-none [&_input]:border-0 [&_input]:bg-light-100 [&_textarea]:!rounded-none [&_textarea]:border-0 [&_textarea]:bg-light-100 [&_[data-slot=select-trigger]]:!rounded-none [&_button]:!rounded-none'

function getRedirectUrl(form: Form): string | null {
  const { redirect, confirmationType } = form

  if (confirmationType !== 'redirect' || !redirect) {
    return null
  }

  if (redirect.type === 'custom' && redirect.url) {
    return redirect.url
  }

  if (redirect.type === 'reference' && redirect.reference?.value) {
    const page = redirect.reference.value
    if (typeof page === 'object' && page.slug) {
      return getPagePath(page as Page)
    }
  }

  return redirect.url ?? null
}

function renderFormField(
  field: FormInputField,
  index: number,
  formMethods: ReturnType<typeof useForm<FormData>>,
  options?: {
    hiddenFieldNames?: Set<string>
    layout?: FormBlockLayout
    wrapperClassName?: string
  },
) {
  if (!field.blockType) {
    return null
  }

  if ('name' in field && field.name && options?.hiddenFieldNames?.has(field.name)) {
    return null
  }

  const {
    control,
    formState: { errors },
    register,
  } = formMethods
  const key = 'id' in field && field.id ? field.id : `${field.blockType}-${index}`

  const layout = options?.layout ?? 'default'
  const width = resolveFieldWidth(field, layout)

  if (field.blockType === 'message') {
    return (
      <div
        key={key}
        className={cn(getFieldLayoutClassName(width, layout), options?.wrapperClassName)}
      >
        <MessageField message={field.message} width={width} />
      </div>
    )
  }

  const FieldComponent = formFields[field.blockType]

  if (!FieldComponent || !('name' in field) || !field.name) {
    return null
  }

  return (
    <div
      key={key}
      className={cn(getFieldLayoutClassName(width, layout), options?.wrapperClassName)}
    >
      <FieldComponent
        {...field}
        width={width}
        control={control}
        errors={errors}
        register={register}
      />
    </div>
  )
}

function renderHeroFormFields(
  fields: FormInputField[],
  formMethods: ReturnType<typeof useForm<FormData>>,
  hiddenFieldNames?: Set<string>,
) {
  const { mainFields, textareaField, otherFields } = partitionFieldsForHeroLayout(fields)

  let fieldIndex = 0
  const renderOptions = { hiddenFieldNames, layout: 'hero' as const }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2">
        {mainFields.map((field) => {
          const node = renderFormField(field, fieldIndex++, formMethods, renderOptions)
          return node
        })}
        {otherFields.map((field) => {
          const node = renderFormField(field, fieldIndex++, formMethods, {
            ...renderOptions,
            wrapperClassName: 'lg:col-span-2',
          })
          return node
        })}
      </div>

      {textareaField && (
        <div
          className={cn(
            'lg:col-start-3 lg:row-span-2 lg:row-start-1',
            '[&_textarea]:min-h-32 lg:[&_textarea]:min-h-full lg:[&_textarea]:h-full',
          )}
        >
          {renderFormField(textareaField, fieldIndex++, formMethods, renderOptions)}
        </div>
      )}
    </>
  )
}

type FormActionsProps = {
  hiddenFieldNames?: Set<string>
  isMultiStep: boolean
  isLastStep: boolean
  isLoading: boolean
  layout: FormBlockLayout
  checkboxFields: FormInputField[]
  formMethods: ReturnType<typeof useForm<FormData>>
  fieldIndexStart: number
  nextLabel: string
  submitButtonLabel?: string | null
}

function FormActions({
  hiddenFieldNames,
  isMultiStep,
  isLastStep,
  isLoading,
  layout,
  checkboxFields,
  formMethods,
  fieldIndexStart,
  nextLabel,
  submitButtonLabel,
}: FormActionsProps) {
  const isHero = layout === 'hero'
  let fieldIndex = fieldIndexStart

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 pt-2',
        isHero
          ? 'lg:col-span-3 lg:flex-row lg:items-center lg:justify-between'
          : 'w-full sm:flex-row sm:items-center sm:justify-between',
      )}
    >
      <div className={cn('flex flex-col gap-3', isHero && 'flex-1')}>
        {isHero &&
          checkboxFields.map((field) => {
            const node = renderFormField(field, fieldIndex++, formMethods, {
              hiddenFieldNames,
              layout: 'hero',
            })
            return node
          })}
      </div>

      {!isMultiStep && !isHero && <div className="hidden sm:block" />}

      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          isHero
            ? 'h-12 w-full cursor-pointer bg-primary-500 px-6 text-base font-semibold uppercase tracking-wide text-white hover:bg-primary-600 sm:ml-auto sm:w-auto lg:px-8'
            : 'w-full rounded-full',
        )}
      >
        {isLastStep ? submitButtonLabel || 'Submit' : nextLabel}
      </Button>
    </div>
  )
}

export function FormBlockClient({
  contextValues,
  enableIntro,
  form,
  introContent,
  layout = 'default',
}: FormBlockClientProps) {
  const router = useRouter()
  const steps = getFormSteps(form)
  const isMultiStep = isMultiStepForm(form)
  const useHeroLayout = layout === 'hero' && !isMultiStep
  const hiddenFieldNames = getHiddenFieldNames(contextValues)

  const formMethods = useForm<FormData>({
    defaultValues: mergeFormDefaultValues(buildInitialFormState(form), contextValues),
  })

  const { handleSubmit, setError: setFieldError, trigger } = formMethods

  const formBlockRef = useRef<HTMLDivElement>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<SubmissionError | undefined>()

  const { id: formID, confirmationMessage, confirmationType, submitButtonLabel } = form

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  const showProgress = isMultiStep && steps.length > 1

  const heroPartition = useHeroLayout
    ? partitionFieldsForHeroLayout(currentStep?.fields ?? [])
    : null

  const scrollToFormTop = () => {
    formBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onSubmit = useCallback(
    (data: FormData) => {
      const submitForm = async () => {
        setError(undefined)

        const { body, headers } = buildFormSubmissionRequest(formID, form, data)

        const loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 400)

        try {
          const req = await fetch('/api/form-submissions', {
            body,
            headers,
            method: 'POST',
          })

          const res = (await req.json()) as {
            errors?: { message: string; path?: string }[]
          }

          if (loadingTimerID) {
            clearTimeout(loadingTimerID)
          }

          if (req.status >= 400) {
            setIsLoading(false)

            const fieldErrors = res.errors?.filter((entry) => entry.path) ?? []
            for (const fieldError of fieldErrors) {
              if (fieldError.path) {
                setFieldError(fieldError.path, {
                  type: 'server',
                  message: fieldError.message,
                })
              }
            }

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: req.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          const redirectUrl = getRedirectUrl(form)
          if (redirectUrl) {
            router.push(redirectUrl)
          }
        } catch {
          if (loadingTimerID) {
            clearTimeout(loadingTimerID)
          }
          setIsLoading(false)
          setError({
            message: 'Something went wrong. Please try again.',
          })
        }
      }

      void submitForm()
    },
    [form, formID, router, setFieldError],
  )

  const handleNextStep = async () => {
    if (!currentStep) {
      return
    }

    const fieldNames = getStepInputNames(currentStep)
    const isValid = fieldNames.length === 0 ? true : await trigger(fieldNames)

    if (!isValid) {
      return
    }

    setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1))
    scrollToFormTop()
  }

  const handleBackStep = () => {
    setCurrentStepIndex((index) => Math.max(index - 1, 0))
    scrollToFormTop()
  }

  const handleFormAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLastStep) {
      void handleSubmit(onSubmit)()
    } else {
      await handleNextStep()
    }
  }

  const nextLabel = currentStep?.nextButtonLabel?.trim() || 'Next'
  const backLabel = currentStep?.backButtonLabel?.trim() || 'Back'

  const heroCheckboxFieldIndexStart = heroPartition
    ? heroPartition.mainFields.length +
      heroPartition.otherFields.length +
      (heroPartition.textareaField ? 1 : 0)
    : 0

  if (layout === 'hero') {
    return (
      <div ref={formBlockRef} className="mx-auto w-full scroll-mt-8 max-w-none">
        {enableIntro && introContent && !hasSubmitted && (
          <div className="prose prose-invert mb-8 max-w-none">
            <ConvertRichText converters={richTextConverters} data={introContent} />
          </div>
        )}

        {error && (
          <div
            className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error.status ? `${error.status}: ` : ''}
            {error.message}
          </div>
        )}

        {isLoading && !hasSubmitted && (
          <p className="mb-4 text-sm text-muted-foreground">Loading, please wait...</p>
        )}

        {!isLoading && hasSubmitted && confirmationType === 'message' && confirmationMessage && (
          <div className="prose max-w-none">
            <ConvertRichText
              converters={richTextConverters}
              data={confirmationMessage as SerializedEditorState}
            />
          </div>
        )}

        {!hasSubmitted && currentStep && (
          <>
            {showProgress && (
              <FormStepProgress
                steps={steps}
                currentIndex={currentStepIndex}
                backLabel={backLabel}
                isLoading={isLoading}
                onBack={handleBackStep}
                showBackButton={!isFirstStep}
              />
            )}

            {!showProgress && currentStep.title && isMultiStep && (
              <h3 className="mb-6 text-lg font-semibold text-foreground">{currentStep.title}</h3>
            )}

            {!showProgress && currentStep.description && (
              <div className="prose mb-6 max-w-none">
                <ConvertRichText
                  converters={richTextConverters}
                  data={currentStep.description as SerializedEditorState}
                />
              </div>
            )}

            <form
              className={cn('grid grid-cols-1 gap-4 lg:grid-cols-3', heroFormFieldClassName)}
              onSubmit={handleFormAction}
              noValidate
            >
              {renderHeroFormFields(currentStep.fields ?? [], formMethods, hiddenFieldNames)}
              <FormActions
                hiddenFieldNames={hiddenFieldNames}
                isMultiStep={isMultiStep}
                isLastStep={isLastStep}
                isLoading={isLoading}
                layout={layout}
                checkboxFields={heroPartition?.checkboxFields ?? []}
                formMethods={formMethods}
                fieldIndexStart={heroCheckboxFieldIndexStart}
                nextLabel={nextLabel}
                submitButtonLabel={submitButtonLabel}
              />
            </form>
          </>
        )}
      </div>
    )
  }

  return (
    <div ref={formBlockRef} className="scroll-mt-8">
      <Card
        className={cn(
          'mx-auto w-full shadow-md',
          showProgress && !hasSubmitted ? 'max-w-4xl' : 'max-w-3xl',
        )}
      >
        {/*<CardHeader className="pb-4">*/}
        {/*  <CardTitle className="text-2xl text-primary">{form.title}</CardTitle>*/}
        {/*</CardHeader>*/}
        <CardContent>
          {error && (
            <div
              className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error.status ? `${error.status}: ` : ''}
              {error.message}
            </div>
          )}

          {isLoading && !hasSubmitted && (
            <p className="mb-4 text-sm text-muted-foreground">Loading, please wait...</p>
          )}

          {!isLoading && hasSubmitted && confirmationType === 'message' && confirmationMessage && (
            <div className="prose prose-invert max-w-none">
              <ConvertRichText
                converters={richTextConverters}
                data={confirmationMessage as SerializedEditorState}
              />
            </div>
          )}

          {!hasSubmitted && currentStep && (
            <>
              {showProgress && (
                <FormStepProgress
                  steps={steps}
                  currentIndex={currentStepIndex}
                  backLabel={backLabel}
                  isLoading={isLoading}
                  onBack={handleBackStep}
                  showBackButton={!isFirstStep}
                />
              )}

              {!showProgress && currentStep.title && isMultiStep && (
                <h3 className="mb-6 text-lg font-semibold text-foreground">{currentStep.title}</h3>
              )}

              {!showProgress && currentStep.description && (
                <div className="prose prose-invert mb-6 max-w-none">
                  <ConvertRichText
                    converters={richTextConverters}
                    data={currentStep.description as SerializedEditorState}
                  />
                </div>
              )}

              <form
                className="flex flex-wrap gap-x-4 gap-y-4 pt-4"
                onSubmit={handleFormAction}
                noValidate
              >
                {currentStep.fields?.map((field, index) =>
                  renderFormField(field, index, formMethods, { hiddenFieldNames }),
                )}
                <FormActions
                  hiddenFieldNames={hiddenFieldNames}
                  isMultiStep={isMultiStep}
                  isLastStep={isLastStep}
                  isLoading={isLoading}
                  layout={layout}
                  checkboxFields={[]}
                  formMethods={formMethods}
                  fieldIndexStart={0}
                  nextLabel={nextLabel}
                  submitButtonLabel={submitButtonLabel}
                />
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
