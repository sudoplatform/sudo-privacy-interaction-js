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
import { RescanVirtualPresenceUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/rescanVirtualPresenceUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('RescanVirtualPresenceUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: RescanVirtualPresenceUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)

    instanceUnderTest = new RescanVirtualPresenceUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('rescans a virtual presence without options', async () => {
      when(mockVirtualPresenceService.rescan(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.execute({ id: 'testId' })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArg] = capture(mockVirtualPresenceService.rescan).first()
      expect(inputArg).toStrictEqual({ id: 'testId' })
      verify(mockVirtualPresenceService.rescan(anything())).once()
    })

    it('rescans a virtual presence with options', async () => {
      when(mockVirtualPresenceService.rescan(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const options = {
        maximumItemsProcessed: 50,
        earliestScanDate: '2026-01-01',
        excludeDomains: ['spam.com'],
      }
      const result = await instanceUnderTest.execute({
        id: 'testId',
        options,
      })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArg] = capture(mockVirtualPresenceService.rescan).first()
      expect(inputArg).toStrictEqual({ id: 'testId', options })
      verify(mockVirtualPresenceService.rescan(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockVirtualPresenceService.rescan(anything())).thenReject(
        new Error('rescan failed'),
      )

      await expect(instanceUnderTest.execute({ id: 'testId' })).rejects.toThrow(
        'rescan failed',
      )
      verify(mockVirtualPresenceService.rescan(anything())).once()
    })
  })
})
