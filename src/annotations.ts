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
    startLines: annotation.location?.startLine,
    endLine: annotation.location?.endLine,
    startColumn: annotation.location?.startColumn,
    endColumn: annotation.location?.endColumn
  }
  return properties
}
