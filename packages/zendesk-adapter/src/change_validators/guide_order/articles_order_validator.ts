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
import { ChangeValidator } from '@salto-io/adapter-api'
import { validateReferences } from './guide_order_validators_utils'
import { ARTICLES_FIELD, ARTICLES_ORDER } from '../../filters/guide_order/guide_orders_utils'

/**
 * Validates that all the elements in the articles order list are references
 */
export const articlesOrderValidator: ChangeValidator = async changes =>
  validateReferences(changes, ARTICLES_FIELD, ARTICLES_ORDER)