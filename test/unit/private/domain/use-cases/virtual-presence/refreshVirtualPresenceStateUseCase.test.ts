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
import { RefreshVirtualPresenceStateUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/refreshVirtualPresenceStateUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('RefreshVirtualPresenceStateUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: RefreshVirtualPresenceStateUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)

    instanceUnderTest = new RefreshVirtualPresenceStateUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('refreshes a virtual presence state successfully', async () => {
      when(mockVirtualPresenceService.refreshState(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [idArg] = capture(mockVirtualPresenceService.refreshState).first()
      expect(idArg).toBe('testId')
      verify(mockVirtualPresenceService.refreshState(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockVirtualPresenceService.refreshState(anything())).thenReject(
        new Error('refresh failed'),
      )

      await expect(instanceUnderTest.execute('testId')).rejects.toThrow(
        'refresh failed',
      )
      verify(mockVirtualPresenceService.refreshState(anything())).once()
    })
  })
})
