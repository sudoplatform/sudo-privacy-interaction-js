/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotSignedInError } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
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
import { SubscribeToVirtualPresenceUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/subscribeToVirtualPresenceUseCase'
import { VirtualPresenceSubscriber } from '../../../../../../src/public/typings/subscription'

describe('SubscribeToVirtualPresenceUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()
  const mockVirtualPresenceSubscriber = mock<VirtualPresenceSubscriber>()
  const mockUserClient = mock<SudoUserClient>()

  let instanceUnderTest: SubscribeToVirtualPresenceUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)
    reset(mockVirtualPresenceSubscriber)
    reset(mockUserClient)

    instanceUnderTest = new SubscribeToVirtualPresenceUseCase(
      instance(mockVirtualPresenceService),
      instance(mockUserClient),
    )
  })

  describe('execute', () => {
    it('subscribes to virtual presence updates successfully', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockVirtualPresenceService.subscribe(anything())).thenResolve()

      await instanceUnderTest.execute({
        subscriptionId: 'sub-1',
        subscriber: mockVirtualPresenceSubscriber,
      })

      verify(mockVirtualPresenceService.subscribe(anything())).once()
    })

    it('throws NotSignedInError when user is not signed in', async () => {
      when(mockUserClient.getSubject()).thenResolve(undefined)

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockVirtualPresenceSubscriber,
        }),
      ).rejects.toThrow(NotSignedInError)

      verify(mockVirtualPresenceService.subscribe(anything())).never()
    })

    it('throws when service throws', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockVirtualPresenceService.subscribe(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockVirtualPresenceSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })
})
