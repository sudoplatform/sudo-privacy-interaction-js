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
import { DisconnectVirtualPresenceUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/disconnectVirtualPresenceUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('DisconnectVirtualPresenceUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: DisconnectVirtualPresenceUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)

    instanceUnderTest = new DisconnectVirtualPresenceUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('disconnects a virtual presence successfully', async () => {
      when(mockVirtualPresenceService.disconnect(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [idArg] = capture(mockVirtualPresenceService.disconnect).first()
      expect(idArg).toBe('testId')
      verify(mockVirtualPresenceService.disconnect(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockVirtualPresenceService.disconnect(anything())).thenReject(
        new Error('disconnect failed'),
      )

      await expect(instanceUnderTest.execute('testId')).rejects.toThrow(
        'disconnect failed',
      )
      verify(mockVirtualPresenceService.disconnect(anything())).once()
    })
  })
})
