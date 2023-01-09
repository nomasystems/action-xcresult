import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('test runs', () => {
  process.env['INPUT_XCRESULT-PATH'] = '__tests__/data/build.xcresult'
  process.env['INPUT_PATH-ROOT'] = '/'
  process.env['INPUT_FAIL-ON-ERROR'] = 'false'
  process.env['INPUT_FAIL-ON-WARNING'] = 'false'
  process.env['INPUT_FAIL-ON-ANALYZER-WARNING'] = 'false'
  process.env['INPUT_FAIL-ON-TEST-FAILURE'] = 'false'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
