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
 * Input for `ConnectVirtualPresenceWithAuthCodeUseCase`.
 *
 * @interface ConnectVirtualPresenceWithAuthCodeUseCaseInput
 */
interface ConnectVirtualPresenceWithAuthCodeUseCaseInput {
  authCode: string
  redirectUri?: string
  relationshipProvider?: RelationshipProviderEntity
}

/**
 * Application business logic for connecting a virtual presence using an authorization code.
 */
export class ConnectVirtualPresenceWithAuthCodeUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ConnectVirtualPresenceWithAuthCodeUseCaseInput,
  ): Promise<VirtualPresenceEntity> {
    this.log.debug(this.constructor.name)
    return await this.virtualPresenceService.connect({
      authCode: {
        authCode: input.authCode,
        redirectUri: input.redirectUri,
      },
      relationshipProvider: input.relationshipProvider,
    })
  }
}
