/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotSignedInError } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { anything, instance, mock, reset, verify, when } from 'ts-mockito'
import { DataHolderService } from '../../../../../../src/private/domain/entities/data-holder/dataHolderService'
import { SubscribeToDataHoldersUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/subscribeToDataHoldersUseCase'
import { DataHolderSubscriber } from '../../../../../../src/public/typings/subscription'

describe('SubscribeToDataHoldersUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()
  const mockDataHolderSubscriber = mock<DataHolderSubscriber>()
  const mockUserClient = mock<SudoUserClient>()

  let instanceUnderTest: SubscribeToDataHoldersUseCase

  beforeEach(() => {
    reset(mockDataHolderService)
    reset(mockDataHolderSubscriber)
    reset(mockUserClient)

    instanceUnderTest = new SubscribeToDataHoldersUseCase(
      instance(mockDataHolderService),
      instance(mockUserClient),
    )
  })

  describe('execute', () => {
    it('subscribes to data holder updates successfully', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockDataHolderService.subscribe(anything())).thenResolve()

      await instanceUnderTest.execute({
        subscriptionId: 'sub-1',
        subscriber: mockDataHolderSubscriber,
      })

      verify(mockDataHolderService.subscribe(anything())).once()
    })

    it('throws NotSignedInError when user is not signed in', async () => {
      when(mockUserClient.getSubject()).thenResolve(undefined)

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockDataHolderSubscriber,
        }),
      ).rejects.toThrow(NotSignedInError)

      verify(mockDataHolderService.subscribe(anything())).never()
    })

    it('throws when service throws', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockDataHolderService.subscribe(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockDataHolderSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })
})
