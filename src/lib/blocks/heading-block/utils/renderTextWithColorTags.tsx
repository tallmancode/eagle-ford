import { Fragment } from 'react'
import { AccentUnder } from '../components/AccentUnder'
import { type HeadingMarkupSegment, parseHeadingColorTags } from './parseHeadingColorTags'

function renderSegments(segments: HeadingMarkupSegment[]): React.ReactNode {
  if (segments.length === 1 && segments[0].type === 'text') {
    return segments[0].value
  }

  return segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <Fragment key={index}>{segment.value}</Fragment>
    }

    if (segment.type === 'colored') {
      return (
        <span key={index} style={{ color: segment.color }}>
          {renderSegments(segment.children)}
        </span>
      )
    }

    return (
      <AccentUnder key={index} color={segment.color}>
        {renderSegments(segment.children)}
      </AccentUnder>
    )
  })
}

export function renderTextWithColorTags(text: string): React.ReactNode {
  return renderSegments(parseHeadingColorTags(text))
}
