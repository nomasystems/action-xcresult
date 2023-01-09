import * as core from '@actions/core'
import path from 'path'
import {xcresultToJson} from './xcresult'
import {outputAnnotations} from './annotations'

async function run(): Promise<void> {
  try {
    const xcresultPath = core.getInput('xcresult-path')
    const pathRoot = core.getInput('path-root')
    const failOnError = core.getBooleanInput('fail-on-error')
    const failOnWarning = core.getBooleanInput('fail-on-warning')
    const failOnAnalyzerWarning = core.getBooleanInput(
      'fail-on-analyzer-warning'
    )
    const failOnTestFailure = core.getBooleanInput('fail-on-test-failure')

    const output = await xcresultToJson(xcresultPath, pathRoot)
    outputAnnotations(output.annotations)

    if (failOnError && (output.metrics?.errorCount ?? 0) > 0) {
      core.setFailed(`${output.metrics?.errorCount} error(s)`)
    } else if (failOnWarning && (output.metrics?.warningCount ?? 0) > 0) {
      core.setFailed(`${output.metrics?.warningCount} warning(s)`)
    } else if (
      failOnAnalyzerWarning &&
      (output.metrics?.analyzerWarningCount ?? 0) > 0
    ) {
      core.setFailed(
        `${output.metrics?.analyzerWarningCount} analyzer warnings(s)`
      )
    } else if (
      failOnTestFailure &&
      (output.metrics?.testFailedCount ?? 0) > 0
    ) {
      core.setFailed(`${output.metrics?.testFailedCount} test(s) failed`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
