import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {ExecOptions} from '@actions/exec'
import {Output} from './__generated__/output'

export async function xcresultToJson(
  xcresultPath: string,
  pathRoot: string
): Promise<Output> {
  const args = [xcresultPath].concat(['--path-root', pathRoot])
  const options: ExecOptions = {silent: true}
  const execOutput = await exec.getExecOutput('xcresult-to-json', args, options)
  if (execOutput.exitCode === 0) {
    return JSON.parse(execOutput.stdout)
  } else {
    if (execOutput.stderr !== '') {
      core.error(`xcresult-to-json: ${execOutput.stderr}`)
    }
    throw Error(
      `xcresult-to-json failed with exit code: ${execOutput.exitCode}`
    )
  }
}
