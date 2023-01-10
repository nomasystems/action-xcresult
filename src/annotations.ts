import * as core from '@actions/core'
import type {AnnotationProperties} from '@actions/core'
import {Annotation} from './__generated__/output'

export function outputAnnotations(annotations: Array<Annotation>) {
  for (let annotation of annotations) {
    switch (annotation.annotationLevel) {
      case 'failure':
        core.error(annotation.message, properties(annotation))
        break
      case 'warning':
        core.warning(annotation.message, properties(annotation))
        break
      case 'notice':
        core.notice(annotation.message, properties(annotation))
        break
    }
  }
}

function properties(annotation: Annotation): AnnotationProperties {
  const properties = {
    title: annotation.title,
    file: annotation.path,
    startLines: addOneToLineColumn(annotation.location?.startLine),
    endLine: addOneToLineColumn(annotation.location?.endLine),
    startColumn: addOneToLineColumn(annotation.location?.startColumn),
    endColumn: addOneToLineColumn(annotation.location?.endColumn)
  }
  return properties
}

// Line numbers and column numbers are 0-based in xcresult
// but 1-based in github annotations.
function addOneToLineColumn(n: number | undefined): number | undefined {
  if (n) {
    return n + 1
  } else {
    return undefined
  }
}
