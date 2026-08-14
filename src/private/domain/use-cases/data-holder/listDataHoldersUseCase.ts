/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { DataHolderEntity } from '../../entities/data-holder/dataHolderEntity'
import { DataHolderService } from '../../entities/data-holder/dataHolderService'

/**
 * Input for `ListDataHoldersUseCase`.
 *
 * @interface ListDataHoldersUseCaseInput
 */
interface ListDataHoldersUseCaseInput {
  virtualPresenceId: string
  limit?: number | undefined
  nextToken?: string | undefined
}

/**
 * Output for `ListDataHoldersUseCase`.
 *
 * @interface ListDataHoldersUseCaseOutput
 */
interface ListDataHoldersUseCaseOutput {
  dataHolders: DataHolderEntity[]
  nextToken?: string
}

/**
 * Application business logic for listing data holders.
 */
export class ListDataHoldersUseCase {
  private readonly log: Logger

  public constructor(private readonly dataHolderService: DataHolderService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ListDataHoldersUseCaseInput,
  ): Promise<ListDataHoldersUseCaseOutput> {
    this.log.debug(this.constructor.name, { input })
    return await this.dataHolderService.list({
      virtualPresenceId: input.virtualPresenceId,
      limit: input.limit,
      nextToken: input.nextToken,
    })
  }
}
