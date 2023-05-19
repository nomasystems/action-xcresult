import * as core from '@actions/core'
import path from 'path'
import {xcresultToJson} from './xcresult'
import {outputAnnotations} from './annotations'

async function run(): Promise<void> {
  try {
    const xcresultPath = core.getInput('xcresult-path')
    const pathRoot = (() => {
      const inputValue = core.getInput('path-root', {required: false})
      if (inputValue !== '') {
        return inputValue
      } else {
        const githubWorkspace = process.env.GITHUB_WORKSPACE
        if (!githubWorkspace) {
          throw new Error('$GITHUB_WORKSPACE is not set')
        }
        return githubWorkspace
      }
    })()
    const failOnError = core.getBooleanInput('fail-on-error')
    const failOnWarning = core.getBooleanInput('fail-on-warning')
    const failOnExternalWarning = core.getBooleanInput(
      'fail-on-external-warning'
    )
    const failOnAnalyzerWarning = core.getBooleanInput(
      'fail-on-analyzer-warning'
    )
    const failOnTestFailure = core.getBooleanInput('fail-on-test-failure')

    const output = await xcresultToJson(xcresultPath, pathRoot)
    outputAnnotations(output.annotations)

    const warningCount =
      (output.metrics?.warningCount ?? 0) +
      (failOnExternalWarning ? output.metrics?.externalWarningCount ?? 0 : 0)
    if (failOnError && (output.metrics?.errorCount ?? 0) > 0) {
      core.setFailed(`${output.metrics?.errorCount} error(s) in xcresult`)
    } else if (failOnWarning && warningCount > 0) {
      core.setFailed(`${warningCount} warning(s) in xcresult`)
    } else if (
      failOnAnalyzerWarning &&
      (output.metrics?.analyzerWarningCount ?? 0) > 0
    ) {
      core.setFailed(
        `${output.metrics?.analyzerWarningCount} analyzer warnings(s) in xcresult`
      )
    } else if (
      failOnTestFailure &&
      (output.metrics?.testFailedCount ?? 0) > 0
    ) {
      core.setFailed(
        `${output.metrics?.testFailedCount} test(s) failed in xcresult`
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
