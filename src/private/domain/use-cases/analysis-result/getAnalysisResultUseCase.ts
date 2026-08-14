/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { AnalysisResultEntity } from '../../entities/analysis-result/analysisResultEntity'
import { AnalysisResultService } from '../../entities/analysis-result/analysisResultService'

/**
 * Application business logic for retrieving an analysis result.
 */
export class GetAnalysisResultUseCase {
  private readonly log: Logger

  public constructor(
    private readonly analysisResultService: AnalysisResultService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(id: string): Promise<AnalysisResultEntity | undefined> {
    this.log.debug(this.constructor.name, { id })
    return await this.analysisResultService.get(id)
  }
}
