import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import {expect, test} from '@jest/globals'

test('test runs', () => {
  let testTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'))
  let runnerToolCache = path.join(testTmp, 'runner-tool-cache')
  let runnerTemp = path.join(testTmp, 'runner-temp')

  process.env['INPUT_XCRESULT-PATH'] = '__tests__/data/build.xcresult'
  process.env['INPUT_PATH-ROOT'] = '/'
  process.env['INPUT_FAIL-ON-ERROR'] = 'false'
  process.env['INPUT_FAIL-ON-WARNING'] = 'false'
  process.env['INPUT_FAIL-ON-ANALYZER-WARNING'] = 'false'
  process.env['INPUT_FAIL-ON-TEST-FAILURE'] = 'false'
  process.env['INPUT_FAIL-ON-EXTERNAL-WARNING'] = 'false'
  process.env['RUNNER_TOOL_CACHE'] = runnerToolCache
  process.env['RUNNER_TEMP'] = runnerTemp
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  try {
    let result = cp.execFileSync(np, [ip], options)
    console.log(result.toString())
  } catch (err) {
    if (hasStdOut(err)) {
      console.log('stdout', err.stdout.toString())
    }
    if (hasStdError(err)) {
      console.log('stderr', err.stderr.toString())
    }
  } finally {
    fs.rmSync(testTmp, {recursive: true})
  }
})

function hasStdOut(err: any): err is {stdout: string} {
  return !!err.stderr
}

function hasStdError(err: any): err is {stderr: string} {
  return !!err.stderr
}
