/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotSignedInError } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { anything, instance, mock, reset, verify, when } from 'ts-mockito'
import { ActionService } from '../../../../../../src/private/domain/entities/action/actionService'
import { SubscribeToActionUseCase } from '../../../../../../src/private/domain/use-cases/action/subscribeToActionUseCase'
import { ActionSubscriber } from '../../../../../../src/public/typings/subscription'

describe('SubscribeToActionUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()
  const mockUserClient = mock<SudoUserClient>()

  let instanceUnderTest: SubscribeToActionUseCase

  const mockSubscriber: ActionSubscriber = {
    actionUpdated: vi.fn(),
    connectionStatusChanged: vi.fn(),
  }

  beforeEach(() => {
    reset(mockActionService)
    reset(mockUserClient)

    instanceUnderTest = new SubscribeToActionUseCase(
      instance(mockActionService),
      instance(mockUserClient),
    )
  })

  describe('execute', () => {
    it('subscribes to action updates successfully', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockActionService.subscribe(anything())).thenResolve()

      await instanceUnderTest.execute({
        subscriptionId: 'sub-1',
        subscriber: mockSubscriber,
      })

      verify(mockActionService.subscribe(anything())).once()
    })

    it('throws NotSignedInError when user is not signed in', async () => {
      when(mockUserClient.getSubject()).thenResolve(undefined)

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockSubscriber,
        }),
      ).rejects.toThrow(NotSignedInError)

      verify(mockActionService.subscribe(anything())).never()
    })

    it('throws when service throws', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockActionService.subscribe(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })
})
