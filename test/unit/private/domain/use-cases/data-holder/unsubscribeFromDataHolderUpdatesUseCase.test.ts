/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { instance, mock, reset, verify } from 'ts-mockito'
import { DataHolderService } from '../../../../../../src/private/domain/entities/data-holder/dataHolderService'
import { UnsubscribeFromDataHoldersUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/unsubscribeFromDataHoldersUseCase'

describe('UnsubscribeFromDataHoldersUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()

  let instanceUnderTest: UnsubscribeFromDataHoldersUseCase

  beforeEach(() => {
    reset(mockDataHolderService)

    instanceUnderTest = new UnsubscribeFromDataHoldersUseCase(
      instance(mockDataHolderService),
    )
  })

  describe('execute', () => {
    it('unsubscribes from data holder updates successfully', () => {
      instanceUnderTest.execute('sub-1')

      verify(mockDataHolderService.unsubscribe('sub-1')).once()
    })
  })
})
