/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { DataHolderEntity } from '../../entities/data-holder/dataHolderEntity'
import { DataHolderService } from '../../entities/data-holder/dataHolderService'

/**
 * Application business logic for retrieving a data holder.
 */
export class GetDataHolderUseCase {
  private readonly log: Logger

  public constructor(private readonly dataHolderService: DataHolderService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(id: string): Promise<DataHolderEntity | undefined> {
    this.log.debug(this.constructor.name, { id })
    return await this.dataHolderService.get(id)
  }
}
