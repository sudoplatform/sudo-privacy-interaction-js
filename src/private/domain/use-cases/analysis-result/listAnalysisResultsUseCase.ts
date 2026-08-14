/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { AnalysisResultEntity } from '../../entities/analysis-result/analysisResultEntity'
import { AnalysisResultService } from '../../entities/analysis-result/analysisResultService'

/**
 * Input for `ListAnalysisResultsUseCase`.
 *
 * @interface ListAnalysisResultsUseCaseInput
 */
interface ListAnalysisResultsUseCaseInput {
  virtualPresenceId: string
  limit?: number | undefined
  nextToken?: string | undefined
}

/**
 * Output for `ListAnalysisResultsUseCase`.
 *
 * @interface ListAnalysisResultsUseCaseOutput
 */
interface ListAnalysisResultsUseCaseOutput {
  analysisResults: AnalysisResultEntity[]
  nextToken?: string
}

/**
 * Application business logic for listing analysis results.
 */
export class ListAnalysisResultsUseCase {
  private readonly log: Logger

  public constructor(
    private readonly analysisResultService: AnalysisResultService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ListAnalysisResultsUseCaseInput,
  ): Promise<ListAnalysisResultsUseCaseOutput> {
    this.log.debug(this.constructor.name, { input })
    return await this.analysisResultService.list({
      virtualPresenceId: input.virtualPresenceId,
      limit: input.limit,
      nextToken: input.nextToken,
    })
  }
}
