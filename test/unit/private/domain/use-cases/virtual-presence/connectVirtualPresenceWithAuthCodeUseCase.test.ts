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
import { RelationshipProviderEntity } from '../../../../../../src/private/domain/entities/inputs/relationshipProviderEntity'
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

      const result = await instanceUnderTest.execute({
        authCode: 'test-auth-code',
      })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArgs] = capture(mockVirtualPresenceService.connect).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        authCode: { authCode: 'test-auth-code', redirectUri: undefined },
        relationshipProvider: undefined,
      })
      verify(mockVirtualPresenceService.connect(anything())).once()
    })

    it('connects a virtual presence with authCode and redirectUri', async () => {
      when(mockVirtualPresenceService.connect(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.execute({
        authCode: 'test-auth-code',
        redirectUri: 'https://example.com/callback',
      })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArgs] = capture(mockVirtualPresenceService.connect).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        authCode: {
          authCode: 'test-auth-code',
          redirectUri: 'https://example.com/callback',
        },
        relationshipProvider: undefined,
      })
      verify(mockVirtualPresenceService.connect(anything())).once()
    })

    it('connects a virtual presence with a relationship provider', async () => {
      when(mockVirtualPresenceService.connect(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.execute({
        authCode: 'test-auth-code',
        relationshipProvider: RelationshipProviderEntity.TestProvider,
      })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArgs] = capture(mockVirtualPresenceService.connect).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        authCode: { authCode: 'test-auth-code', redirectUri: undefined },
        relationshipProvider: RelationshipProviderEntity.TestProvider,
      })
      verify(mockVirtualPresenceService.connect(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockVirtualPresenceService.connect(anything())).thenReject(
        new Error('connection failed'),
      )

      await expect(
        instanceUnderTest.execute({ authCode: 'bad-code' }),
      ).rejects.toThrow('connection failed')
      verify(mockVirtualPresenceService.connect(anything())).once()
    })
  })
})
