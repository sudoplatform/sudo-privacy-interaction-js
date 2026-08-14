/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  anything,
  capture,
  instance,
  mock,
  reset,
  verify,
  when,
} from 'ts-mockito'
import { VirtualPresenceService } from '../../../../../../src/private/domain/entities/virtual-presence/virtualPresenceService'
import { ConnectVirtualPresenceWithRefreshTokenUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/connectVirtualPresenceWithRefreshTokenUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ConnectVirtualPresenceWithRefreshTokenUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: ConnectVirtualPresenceWithRefreshTokenUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)

    instanceUnderTest = new ConnectVirtualPresenceWithRefreshTokenUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('connects a virtual presence with refreshToken', async () => {
      when(mockVirtualPresenceService.connect(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const refreshToken = {
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
        scopes: ['emailAddress'],
        expiresInEpochMs: 1000000,
      }

      const result = await instanceUnderTest.execute(refreshToken)

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArgs] = capture(mockVirtualPresenceService.connect).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        refreshToken: refreshToken,
      })
      verify(mockVirtualPresenceService.connect(anything())).once()
    })
  })
})
