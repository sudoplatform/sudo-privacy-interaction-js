/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnDataHoldersUpdateSubscription } from '../../../gen/graphqlTypes'
import { DataHolder } from '../../../public/typings/dataHolder'
import {
  ConnectionState,
  DataHolderSubscriber,
} from '../../../public/typings/subscription'
import { BaseSubscriptionManager } from '../common/baseSubscriptionManager'

export type DataHolderSubscribable = OnDataHoldersUpdateSubscription

export class DataHolderSubscriptionManager<
  T extends DataHolderSubscribable,
  S extends DataHolderSubscriber,
>
  extends BaseSubscriptionManager<T, S>
  implements DataHolderSubscriber
{
  /**
   * Notifies subscribers of data holder updates.
   *
   * @param dataHolders The updated data holders.
   */
  public dataHoldersUpdated(dataHolders: DataHolder[]): void {
    for (const subscriber of this.getSubscribers()) {
      subscriber.dataHoldersUpdated(dataHolders)
    }
  }

  public connectionStatusChanged(state: ConnectionState): void {
    super.connectionStatusChanged(state)
  }
}
