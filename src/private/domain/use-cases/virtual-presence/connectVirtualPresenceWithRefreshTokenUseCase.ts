/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { RelationshipProviderEntity } from '../../entities/inputs/relationshipProviderEntity'
import { VirtualPresenceEntity } from '../../entities/virtual-presence/virtualPresenceEntity'
import { VirtualPresenceService } from '../../entities/virtual-presence/virtualPresenceService'

/**
 * Input for `ConnectVirtualPresenceWithRefreshTokenUseCase`.
 *
 * @interface ConnectVirtualPresenceWithRefreshTokenUseCaseInput
 */
interface ConnectVirtualPresenceWithRefreshTokenUseCaseInput {
  refreshToken: string
  providerIdentity: string
  scopes?: string[]
  expiresInEpochMs?: number
  relationshipProvider?: RelationshipProviderEntity
}

/**
 * Application business logic for connecting a virtual presence with a pre-obtained refresh token.
 */
export class ConnectVirtualPresenceWithRefreshTokenUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ConnectVirtualPresenceWithRefreshTokenUseCaseInput,
  ): Promise<VirtualPresenceEntity> {
    this.log.debug(this.constructor.name)
    return await this.virtualPresenceService.connect({
      refreshToken: {
        refreshToken: input.refreshToken,
        providerIdentity: input.providerIdentity,
        scopes: input.scopes,
        expiresInEpochMs: input.expiresInEpochMs,
      },
      relationshipProvider: input.relationshipProvider,
    })
  }
}
