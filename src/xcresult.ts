import * as exec from '@actions/exec'
import {ExecOptions} from '@actions/exec'
import {Output} from './__generated__/output'

export async function xcresultToJson(
  xcresultPath: string,
  pathRoot: string
): Promise<Output> {
  const args = [xcresultPath].concat(['--path-root', pathRoot])

  var output = ''
  const options: ExecOptions = {silent: true}
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString()
    }
  }
  await exec.exec('xcresult-to-json', args, options)
  return JSON.parse(output) as Output
}
