/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnVirtualPresenceUpdateSubscription } from '../../../gen/graphqlTypes'
import {
  ConnectionState,
  VirtualPresence,
  VirtualPresenceSubscriber,
} from '../../../public'
import { BaseSubscriptionManager } from '../common/baseSubscriptionManager'

export type Subscribable = OnVirtualPresenceUpdateSubscription

export class VirtualPresenceSubscriptionManager<
  T extends Subscribable,
  S extends VirtualPresenceSubscriber,
>
  extends BaseSubscriptionManager<T, S>
  implements VirtualPresenceSubscriber
{
  /**
   * Notifies subscribers of a virtual presence update.
   *
   * @param virtualPresence An updated virtual presence.
   */
  public virtualPresenceUpdated(virtualPresence: VirtualPresence): void {
    for (const subscriber of this.getSubscribers()) {
      subscriber.virtualPresenceUpdated(virtualPresence)
    }
  }

  public connectionStatusChanged(state: ConnectionState): void {
    super.connectionStatusChanged(state)
  }
}
