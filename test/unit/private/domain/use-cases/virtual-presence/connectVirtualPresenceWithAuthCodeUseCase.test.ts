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
import { ConnectVirtualPresenceWithAuthCodeUseCase } from '../../../../../../src/private/domain/use-cases/virtual-presence/connectVirtualPresenceWithAuthCodeUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ConnectVirtualPresenceWithAuthCodeUseCase Test Suite', () => {
  const mockVirtualPresenceService = mock<VirtualPresenceService>()

  let instanceUnderTest: ConnectVirtualPresenceWithAuthCodeUseCase

  beforeEach(() => {
    reset(mockVirtualPresenceService)

    instanceUnderTest = new ConnectVirtualPresenceWithAuthCodeUseCase(
      instance(mockVirtualPresenceService),
    )
  })

  describe('execute', () => {
    it('connects a virtual presence with authCode', async () => {
      when(mockVirtualPresenceService.connect(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.execute('test-auth-code')

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArgs] = capture(mockVirtualPresenceService.connect).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        authCode: 'test-auth-code',
      })
      verify(mockVirtualPresenceService.connect(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockVirtualPresenceService.connect(anything())).thenReject(
        new Error('connection failed'),
      )

      await expect(instanceUnderTest.execute('bad-code')).rejects.toThrow(
        'connection failed',
      )
      verify(mockVirtualPresenceService.connect(anything())).once()
    })
  })
})
