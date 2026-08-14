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
import { ListVirtualPresencesUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/listVirtualPresencesUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ListVirtualPresencesUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: ListVirtualPresencesUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)
    instanceUnderTest = new ListVirtualPresencesUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('lists virtual presences successfully', async () => {
      when(mockVirtualPresenceService.list(anything())).thenResolve({
        virtualPresences: [EntityDataFactory.virtualPresence],
      })

      const result = await instanceUnderTest.execute({})

      expect(result).toStrictEqual({
        virtualPresences: [EntityDataFactory.virtualPresence],
      })
      const [inputArgs] = capture(mockVirtualPresenceService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        limit: undefined,
        nextToken: undefined,
      })
      verify(mockVirtualPresenceService.list(anything())).once()
    })

    it('lists virtual presences successfully with empty result items', async () => {
      when(mockVirtualPresenceService.list(anything())).thenResolve({
        virtualPresences: [],
      })
      const result = await instanceUnderTest.execute({})

      expect(result).toStrictEqual({ virtualPresences: [] })
      const [inputArgs] = capture(mockVirtualPresenceService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        limit: undefined,
        nextToken: undefined,
      })
      verify(mockVirtualPresenceService.list(anything())).once()
    })

    it('passes limit and nextToken to the service correctly', async () => {
      when(mockVirtualPresenceService.list(anything())).thenResolve({
        virtualPresences: [EntityDataFactory.virtualPresence],
        nextToken: 'resultNextToken',
      })

      const result = await instanceUnderTest.execute({
        limit: 50,
        nextToken: 'inputNextToken',
      })

      expect(result).toStrictEqual({
        virtualPresences: [EntityDataFactory.virtualPresence],
        nextToken: 'resultNextToken',
      })
      const [inputArgs] = capture(mockVirtualPresenceService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        limit: 50,
        nextToken: 'inputNextToken',
      })
      verify(mockVirtualPresenceService.list(anything())).once()
    })
  })
})
