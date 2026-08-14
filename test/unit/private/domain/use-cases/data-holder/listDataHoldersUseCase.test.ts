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
import { DataHolderService } from '../../../../../../src/private/domain/entities/data-holder/dataHolderService'
import { ListDataHoldersUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/listDataHoldersUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ListDataHoldersUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()

  let instanceUnderTest: ListDataHoldersUseCase

  beforeEach(() => {
    reset(mockDataHolderService)
    instanceUnderTest = new ListDataHoldersUseCase(
      instance(mockDataHolderService),
    )
  })

  describe('execute', () => {
    it('lists data holders successfully', async () => {
      when(mockDataHolderService.list(anything())).thenResolve({
        dataHolders: [EntityDataFactory.dataHolder],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.execute({
        virtualPresenceId: 'testVirtualPresenceId',
      })

      expect(result).toStrictEqual({
        dataHolders: [EntityDataFactory.dataHolder],
        nextToken: 'nextToken',
      })
      const [inputArgs] = capture(mockDataHolderService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: undefined,
        nextToken: undefined,
      })
      verify(mockDataHolderService.list(anything())).once()
    })

    it('lists data holders successfully with empty result items', async () => {
      when(mockDataHolderService.list(anything())).thenResolve({
        dataHolders: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.execute({
        virtualPresenceId: 'testVirtualPresenceId',
      })

      expect(result).toStrictEqual({
        dataHolders: [],
        nextToken: undefined,
      })
      verify(mockDataHolderService.list(anything())).once()
    })

    it('passes limit and nextToken to the service correctly', async () => {
      when(mockDataHolderService.list(anything())).thenResolve({
        dataHolders: [EntityDataFactory.dataHolder],
        nextToken: 'resultNextToken',
      })

      const result = await instanceUnderTest.execute({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 10,
        nextToken: 'inputNextToken',
      })

      expect(result).toStrictEqual({
        dataHolders: [EntityDataFactory.dataHolder],
        nextToken: 'resultNextToken',
      })
      const [inputArgs] = capture(mockDataHolderService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 10,
        nextToken: 'inputNextToken',
      })
      verify(mockDataHolderService.list(anything())).once()
    })
  })
})
