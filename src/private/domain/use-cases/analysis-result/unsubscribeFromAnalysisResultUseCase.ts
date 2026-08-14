/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { AnalysisResultService } from '../../entities/analysis-result/analysisResultService'

/**
 * Application business logic for unsubscribing from analysis result events.
 */
export class UnsubscribeFromAnalysisResultUseCase {
  private readonly log: Logger

  public constructor(
    private readonly analysisResultService: AnalysisResultService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  execute(subscriptionId: string): void {
    this.log.debug(this.constructor.name, {
      subscriptionId,
    })
    this.analysisResultService.unsubscribe(subscriptionId)
  }
}
