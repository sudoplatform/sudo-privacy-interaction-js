/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionFulfilmentMethod, ActionIntent } from '../typings/action'

/**
 * Properties required to initiate an action against a data holder relationship.
 *
 * @interface InitiateActionInput
 * @property {string} dataHolderId The data holder relationship to scope the action to.
 * @property {ActionIntent} intent The intent of the action to initiate.
 * @property {ActionFulfilmentMethod} fulfilmentMethod The fulfilment method the client
 *  was offered for this intent. Initiation fails if the server re-resolves a different
 *  method.
 */
export interface InitiateActionInput {
  dataHolderId: string
  intent: ActionIntent
  fulfilmentMethod: ActionFulfilmentMethod
}

/**
 * Properties required to list the actions available for a data holder relationship.
 *
 * @interface ListAvailableActionsInput
 * @property {string} dataHolderId The data holder relationship to list available actions for.
 */
export interface ListAvailableActionsInput {
  dataHolderId: string
}
