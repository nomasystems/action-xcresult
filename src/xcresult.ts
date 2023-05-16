import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import {ExecOptions} from '@actions/exec'
import {Output} from './__generated__/output'

export async function xcresultToJson(
  xcresultPath: string,
  pathRoot: string
): Promise<Output> {
  const args = [xcresultPath].concat(['--path-root', pathRoot])
  const options: ExecOptions = {silent: true}
  const toolPath = await cachedDownload()
  const execOutput = await exec.getExecOutput(toolPath, args, options)
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

async function cachedDownload(): Promise<string> {
  const name = 'xcresult-to-json'
  const version = '0.2'
  const downloadUrl = `https://github.com/nomasystems/xcresult-to-json/releases/download/${version}/xcresult-to-json.zip`

  var cachedPath = tc.find(name, version)
  if (cachedPath) {
    core.info(`Found ${name} in cache: ${cachedPath}`)
  } else {
    core.info(`Downloading ${name}`)
    const downloadPath = await tc.downloadTool(downloadUrl)
    const extractedDir = await tc.extractZip(downloadPath)
    cachedPath = await tc.cacheDir(extractedDir, name, version)
  }
  return path.join(cachedPath, name)
}
