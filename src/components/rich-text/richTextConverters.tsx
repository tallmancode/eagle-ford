import { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  TextJSXConverter,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'
import { cn } from '@/lib/utils/cn'
import { getPagePath } from '@/lib/utils/getPagePath'
import type { Page } from '@/payload-types'
import { richTextColorState } from '@/lib/blocks/rich-text-block/richTextColors'

type NodeTypes = DefaultNodeTypes

// Helper function to get alignment class from format
export function getAlignmentClass(format?: string | number): string {
  if (!format) return ''

  if (typeof format === 'string') {
    switch (format) {
      case 'center':
        return 'text-center'
      case 'right':
      case 'end':
        return 'text-right'
      case 'justify':
        return 'text-justify'
      case 'left':
      case 'start':
        return 'text-left'
      default:
        return ''
    }
  }

  // Lexical numeric format values: 1 = left, 2 = center, 3 = right, 4 = justify
  switch (format) {
    case 2:
      return 'text-center'
    case 3:
      return 'text-right'
    case 4:
      return 'text-justify'
    default:
      return 'text-left'
  }
}

// Convert internal document links to href paths
export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!

  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }

  switch (relationTo) {
    case 'pages':
      return getPagePath(value as unknown as Page)
    default:
      return `/${relationTo}/${value.slug}`
  }
}

const richTextLinkClassName = 'text-primary underline underline-offset-2 hover:opacity-80'

const styledLinkConverters = (() => {
  const linkConverters = LinkJSXConverter({ internalDocToHref })

  const applyLinkClass = (element: React.ReactNode) => {
    if (!React.isValidElement<{ className?: string }>(element)) return element

    return React.cloneElement(element, {
      className: cn(richTextLinkClassName, element.props.className),
    })
  }

  return {
    link: (
      args: Parameters<
        Extract<NonNullable<typeof linkConverters.link>, (...args: never) => unknown>
      >[0],
    ) => {
      if (typeof linkConverters.link !== 'function') return null
      return applyLinkClass(linkConverters.link(args))
    },
    autolink: (
      args: Parameters<
        Extract<NonNullable<typeof linkConverters.autolink>, (...args: never) => unknown>
      >[0],
    ) => {
      if (typeof linkConverters.autolink !== 'function') return null
      return applyLinkClass(linkConverters.autolink(args))
    },
  }
})()

// JSX converters for rich text content
export const richTextConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...styledLinkConverters,
  text: (args) => {
    const { node, nodesToJSX: _nodesToJSX } = args
    // Apply base formatting via the default text converter
    const textConverter = TextJSXConverter.text
    const baseText =
      typeof textConverter === 'function'
        ? textConverter(args as Parameters<typeof textConverter>[0])
        : textConverter

    // Read Lexical node state (stored under the "$" key by TextStateFeature)
    const nodeState = (node as Record<string, unknown>)['$'] as Record<string, string> | undefined
    if (!nodeState) return baseText

    // Build inline style from all active state values
    const inlineStyle: Record<string, string> = {}
    for (const colorKey of Object.values(nodeState)) {
      const entry = richTextColorState[colorKey]
      if (entry?.css) {
        Object.assign(inlineStyle, entry.css)
      }
    }

    if (Object.keys(inlineStyle).length === 0) return baseText

    return <span style={inlineStyle as React.CSSProperties}>{baseText}</span>
  },
  heading: ({ node, nodesToJSX }) => {
    const alignClass = getAlignmentClass(
      'format' in node ? (node.format as string | number) : undefined,
    )
    if (node.tag === 'h1') {
      return (
        <h1 className={cn('text-3xl font-bold', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </h1>
      )
    }
    if (node.tag === 'h2') {
      return (
        <h2 className={cn('text-2xl font-bold', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </h2>
      )
    }
    if (node.tag === 'h3') {
      return (
        <h3 className={cn('text-xl font-bold', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </h3>
      )
    }
    if (node.tag === 'h4') {
      return (
        <h4 className={cn('text-lg font-bold', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </h4>
      )
    }
    if (node.tag === 'h5') {
      return (
        <h5 className={cn('text-base font-bold', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </h5>
      )
    }
    if (node.tag === 'h6') {
      return (
        <h6 className={cn('text-sm font-bold', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </h6>
      )
    }
    return null // Fallback to default rendering for other heading types
  },
  list: ({ node, nodesToJSX }) => {
    const alignClass = getAlignmentClass(
      'format' in node ? (node.format as string | number) : undefined,
    )
    if (node.listType === 'bullet') {
      return (
        <ul className={cn('my-4 ml-6 list-disc space-y-2 [&>li]:mt-2', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </ul>
      )
    }
    if (node.listType === 'number') {
      return (
        <ol className={cn('my-4 ml-6 list-decimal space-y-2 [&>li]:mt-2', alignClass)}>
          {nodesToJSX({ nodes: node.children })}
        </ol>
      )
    }
    return null
  },
  listitem: ({ node, nodesToJSX }) => {
    return <li className="pl-2 leading-relaxed">{nodesToJSX({ nodes: node.children })}</li>
  },
  paragraph: ({ node, nodesToJSX }) => {
    const alignClass = getAlignmentClass(
      'format' in node ? (node.format as string | number) : undefined,
    )
    return (
      <p className={cn('my-4 leading-7 [&:not(:first-child)]:mt-6 first:mt-0', alignClass)}>
        {nodesToJSX({ nodes: node.children })}
      </p>
    )
  },
  quote: ({ node, nodesToJSX }) => {
    const alignClass = getAlignmentClass(
      'format' in node ? (node.format as string | number) : undefined,
    )
    return (
      <blockquote
        className={cn(
          'my-6 border-l-4 border-gray-300 pl-6 italic text-gray-700 dark:border-gray-700 dark:text-gray-300',
          alignClass,
        )}
      >
        {nodesToJSX({ nodes: node.children })}
      </blockquote>
    )
  },
  inlineCode: ({ node }) => {
    return (
      <code className="relative rounded bg-gray-100 px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        {node.text}
      </code>
    )
  },
  horizontalrule: () => {
    return <hr className="my-8 border-t border-gray-200 dark:border-gray-800" />
  },
})
