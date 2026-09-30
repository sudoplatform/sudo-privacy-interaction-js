/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnActionStatusUpdateSubscription } from '../../../gen/graphqlTypes'
import { Action } from '../../../public/typings/action'
import {
  ActionSubscriber,
  ConnectionState,
} from '../../../public/typings/subscription'
import { BaseSubscriptionManager } from '../common/baseSubscriptionManager'

export type ActionSubscribable = OnActionStatusUpdateSubscription

export class ActionSubscriptionManager<
  T extends ActionSubscribable,
  S extends ActionSubscriber,
>
  extends BaseSubscriptionManager<T, S>
  implements ActionSubscriber
{
  /**
   * Notifies subscribers of an action status update.
   *
   * @param action The updated action.
   */
  public actionUpdated(action: Action): void {
    for (const subscriber of this.getSubscribers()) {
      subscriber.actionUpdated(action)
    }
  }

  public connectionStatusChanged(state: ConnectionState): void {
    super.connectionStatusChanged(state)
  }
}
