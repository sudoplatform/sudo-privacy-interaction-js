/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { instance, mock, reset, verify } from 'ts-mockito'
import { VirtualPresenceService } from '../../../../../../src/private/domain/entities/virtual-presence/virtualPresenceService'
import { UnsubscribeFromVirtualPresenceUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/unsubscribeFromVirtualPresenceUseCase'

describe('UnsubscribeFromVirtualPresenceUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: UnsubscribeFromVirtualPresenceUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)

    instanceUnderTest = new UnsubscribeFromVirtualPresenceUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('unsubscribes from virtual presence updates successfully', () => {
      instanceUnderTest.execute('sub-1')

      verify(mockVirtualPresenceService.unsubscribe('sub-1')).once()
    })
  })
})
