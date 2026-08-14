/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { VirtualPresenceEntity } from '../../entities/virtual-presence/virtualPresenceEntity'
import { VirtualPresenceService } from '../../entities/virtual-presence/virtualPresenceService'

/**
 * Input for `ListVirtualPresencesUseCase`.
 *
 * @interface ListVirtualPresencesUseCaseInput
 */
interface ListVirtualPresencesUseCaseInput {
  limit?: number | undefined
  nextToken?: string | undefined
}

/**
 * Output for `ListVirtualPresencesUseCase`.
 *
 * @interface ListVirtualPresencesUseCaseOutput
 */
interface ListVirtualPresencesUseCaseOutput {
  virtualPresences: VirtualPresenceEntity[]
  nextToken?: string
}

/**
 * Application business logic for listing all virtual presences for this client.
 */
export class ListVirtualPresencesUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ListVirtualPresencesUseCaseInput,
  ): Promise<ListVirtualPresencesUseCaseOutput> {
    this.log.debug(this.constructor.name, {
      input,
    })
    return await this.virtualPresenceService.list({
      limit: input.limit,
      nextToken: input.nextToken,
    })
  }
}
