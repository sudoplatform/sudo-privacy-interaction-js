/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnAnalysisResultUpdateSubscription } from '../../../gen/graphqlTypes'
import { AnalysisResultUpdate } from '../../../public/typings/analysisResult'
import {
  AnalysisResultSubscriber,
  ConnectionState,
} from '../../../public/typings/subscription'
import { BaseSubscriptionManager } from '../common/baseSubscriptionManager'

export type AnalysisResultSubscribable = OnAnalysisResultUpdateSubscription

export class AnalysisResultSubscriptionManager<
  T extends AnalysisResultSubscribable,
  S extends AnalysisResultSubscriber,
>
  extends BaseSubscriptionManager<T, S>
  implements AnalysisResultSubscriber
{
  /**
   * Notifies subscribers of an analysis result update.
   *
   * @param update The analysis result update.
   */
  public analysisResultUpdated(update: AnalysisResultUpdate): void {
    for (const subscriber of this.getSubscribers()) {
      subscriber.analysisResultUpdated(update)
    }
  }

  public connectionStatusChanged(state: ConnectionState): void {
    super.connectionStatusChanged(state)
  }
}
