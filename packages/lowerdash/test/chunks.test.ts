/*
*                      Copyright 2022 Salto Labs Ltd.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { weightedChunks } from '../src/chunks'

describe('weightedChunks', () => {
  it('should split chunks correctly when first chunk is smaller than max size', () => {
    const chunks = weightedChunks(['a', 'bb', 'cccc', 'dddddd', 'eeeeeeeeee'], 7, val => val.length)
    expect(chunks).toEqual([['a', 'bb', 'cccc'], ['dddddd'], ['eeeeeeeeee']])
  })
  it('should split chunks correctly when first chunk is larger than max size', () => {
    const chunks = weightedChunks(['eeeeeeeeee', 'dddddd', 'cccc', 'bb', 'a'], 7, val => val.length)
    expect(chunks).toEqual([['eeeeeeeeee'], ['dddddd'], ['cccc', 'bb', 'a']])
  })
})
