import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import * as crypto from 'crypto'
import * as fs from 'fs'
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
  const version = '0.2.0'
  const downloadUrl = `https://github.com/nomasystems/xcresult-to-json/releases/download/${version}/xcresult-to-json.zip`
  const checksum =
    '1b44cffc86758237413f3fca49ae9686f3bd65fea60b95cbd1c6d29967cb89da'

  var cachedPath = tc.find(name, version)
  if (cachedPath) {
    core.debug(`Found ${name} in cache: ${cachedPath}`)
  } else {
    core.debug(`Downloading ${name}`)
    const downloadPath = await tc.downloadTool(downloadUrl)
    const downloadChecksum = fileChecksum(downloadPath)
    if (downloadChecksum !== checksum) {
      throw new Error(
        `${downloadPath} checksum mismatch, actual: ${downloadChecksum}, expected: ${checksum}`
      )
    }
    const extractedDir = await tc.extractZip(downloadPath)
    cachedPath = await tc.cacheDir(extractedDir, name, version)
  }
  return path.join(cachedPath, name)
}

function fileChecksum(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath)
  const hashSum = crypto.createHash('sha256')
  hashSum.update(fileBuffer)
  return hashSum.digest('hex')
}
