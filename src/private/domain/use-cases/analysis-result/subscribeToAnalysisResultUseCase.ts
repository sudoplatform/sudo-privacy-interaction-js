/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultLogger,
  Logger,
  NotSignedInError,
} from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { AnalysisResultSubscriber } from '../../../../public/typings/subscription'
import { AnalysisResultService } from '../../entities/analysis-result/analysisResultService'

/**
 * Input for `SubscribeToAnalysisResultUseCase`.
 *
 * @interface SubscribeToAnalysisResultUseCaseInput
 */
export interface SubscribeToAnalysisResultUseCaseInput {
  subscriptionId: string
  subscriber: AnalysisResultSubscriber
}

/**
 * Application business logic for subscribing to analysis result events.
 */
export class SubscribeToAnalysisResultUseCase {
  private readonly log: Logger

  public constructor(
    private readonly analysisResultService: AnalysisResultService,
    private readonly sudoUserClient: SudoUserClient,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(input: SubscribeToAnalysisResultUseCaseInput): Promise<void> {
    this.log.debug(this.constructor.name, {
      subscriptionId: input.subscriptionId,
    })

    const owner = await this.sudoUserClient.getSubject()
    if (!owner) {
      throw new NotSignedInError()
    }

    await this.analysisResultService.subscribe({
      subscriptionId: input.subscriptionId,
      owner,
      subscriber: input.subscriber,
    })
  }
}
