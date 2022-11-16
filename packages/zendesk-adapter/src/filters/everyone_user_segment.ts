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
import { logger } from '@salto-io/logging'
import {
  InstanceElement, isObjectType, ObjectType,
} from '@salto-io/adapter-api'
import { elements as elementsUtils } from '@salto-io/adapter-components'
import { FilterCreator } from '../filter'
import { USER_SEGMENT_TYPE_NAME, ZENDESK } from '../constants'
import { FETCH_CONFIG } from '../config'

const log = logger(module)
const { RECORDS_PATH } = elementsUtils

export const EVERYONE = 'Everyone'

export const createEveryoneUserSegmentInstance = (userSegmentType: ObjectType): InstanceElement => (
  new InstanceElement(
    EVERYONE,
    userSegmentType,
    { user_type: EVERYONE, built_in: true, name: EVERYONE },
    [ZENDESK, RECORDS_PATH, USER_SEGMENT_TYPE_NAME, EVERYONE],
  )
)

/**
 * Adds a user_segment for "Everyone" entity
 */
const filterCreator: FilterCreator = ({ config, fetchQuery }) => ({
  onFetch: async elements => {
    if (!config[FETCH_CONFIG].enableGuide || !fetchQuery.isTypeMatch(USER_SEGMENT_TYPE_NAME)) {
      return
    }
    const userSegmentType = elements
      .filter(element => element.elemID.typeName === USER_SEGMENT_TYPE_NAME)
      .find(isObjectType)
    if (userSegmentType === undefined) {
      log.error("Couldn't find user_segment type.")
      return
    }
    const everyoneUserSegmentInstance = createEveryoneUserSegmentInstance(userSegmentType)
    elements.push(everyoneUserSegmentInstance)
  },
})

export default filterCreator