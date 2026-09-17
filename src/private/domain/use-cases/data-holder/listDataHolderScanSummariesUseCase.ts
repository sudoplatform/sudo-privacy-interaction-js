/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { DataHolderScanSummaryEntity } from '../../entities/data-holder/dataHolderEntity'
import { DataHolderService } from '../../entities/data-holder/dataHolderService'

/**
 * Input for `ListDataHolderScanSummariesUseCase`.
 *
 * @interface ListDataHolderScanSummariesUseCaseInput
 */
interface ListDataHolderScanSummariesUseCaseInput {
  dataHolderId: string
  limit?: number | undefined
  nextToken?: string | undefined
}

/**
 * Output for `ListDataHolderScanSummariesUseCase`.
 *
 * @interface ListDataHolderScanSummariesUseCaseOutput
 */
interface ListDataHolderScanSummariesUseCaseOutput {
  scanSummaries: DataHolderScanSummaryEntity[]
  nextToken?: string
}

/**
 * Application business logic for listing scan summaries for a data holder.
 */
export class ListDataHolderScanSummariesUseCase {
  private readonly log: Logger

  public constructor(private readonly dataHolderService: DataHolderService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ListDataHolderScanSummariesUseCaseInput,
  ): Promise<ListDataHolderScanSummariesUseCaseOutput> {
    this.log.debug(this.constructor.name, { input })
    return await this.dataHolderService.listScanSummaries({
      dataHolderId: input.dataHolderId,
      limit: input.limit,
      nextToken: input.nextToken,
    })
  }
}
