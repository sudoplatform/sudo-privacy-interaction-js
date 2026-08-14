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
import Observable from 'zen-observable'
import { ApiClient } from '../../../../../src/private/data/common/apiClient'
import { DefaultVirtualPresenceService } from '../../../../../src/private/data/virtual-presence/defaultVirtualPresenceService'
import {
  ConnectionState,
  VirtualPresenceSubscriber,
} from '../../../../../src/public'
import { EntityDataFactory } from '../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../data-factory/graphQL'

describe('DefaultVirtualPresenceService Test Suite', () => {
  const mockAppSync = mock<ApiClient>()

  let instanceUnderTest: DefaultVirtualPresenceService

  beforeEach(() => {
    reset(mockAppSync)
    instanceUnderTest = new DefaultVirtualPresenceService(instance(mockAppSync))
  })

  describe('connect', () => {
    it('calls appSync with authCode input and returns result correctly', async () => {
      when(mockAppSync.connectVirtualPresence(anything())).thenResolve(
        GraphQLDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.connect({
        authCode: 'test-auth-code',
      })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [inputArgs] = capture(mockAppSync.connectVirtualPresence).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        authCode: 'test-auth-code',
      })
      verify(mockAppSync.connectVirtualPresence(anything())).once()
    })

    it('calls appSync with refreshToken input and returns result correctly', async () => {
      when(mockAppSync.connectVirtualPresence(anything())).thenResolve(
        GraphQLDataFactory.virtualPresence,
      )

      const refreshToken = {
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
        scopes: ['emailAddress'],
      }

      await instanceUnderTest.connect({ refreshToken })

      const [inputArgs] = capture(mockAppSync.connectVirtualPresence).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        refreshToken,
      })
      verify(mockAppSync.connectVirtualPresence(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.connectVirtualPresence(anything())).thenReject(
        new Error('connect failed'),
      )

      await expect(
        instanceUnderTest.connect({ authCode: 'bad-code' }),
      ).rejects.toThrow('connect failed')
      verify(mockAppSync.connectVirtualPresence(anything())).once()
    })
  })

  describe('list', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.listVirtualPresences(anything())).thenResolve({
        items: [GraphQLDataFactory.virtualPresence],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.list({
        limit: 1,
        nextToken: 'nextToken',
      })

      expect(result).toStrictEqual({
        virtualPresences: [EntityDataFactory.virtualPresence],
        nextToken: 'nextToken',
      })
      const [inputArg] = capture(mockAppSync.listVirtualPresences).first()
      expect(inputArg).toStrictEqual({ limit: 1, nextToken: 'nextToken' })
      verify(mockAppSync.listVirtualPresences(anything())).once()
    })

    it('returns empty list when appSync returns no items', async () => {
      when(mockAppSync.listVirtualPresences(anything())).thenResolve({
        items: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.list({})

      expect(result).toStrictEqual({
        virtualPresences: [],
        nextToken: undefined,
      })
      verify(mockAppSync.listVirtualPresences(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.listVirtualPresences(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(instanceUnderTest.list({})).rejects.toThrow('GraphQL error')
      verify(mockAppSync.listVirtualPresences(anything())).once()
    })
  })

  describe('rescan', () => {
    it('calls appSync without options and returns result correctly', async () => {
      when(
        mockAppSync.rescanVirtualPresence(anything(), anything()),
      ).thenResolve(GraphQLDataFactory.virtualPresence)

      const result = await instanceUnderTest.rescan({ id: 'testId' })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [idArg, optionsArg] = capture(
        mockAppSync.rescanVirtualPresence,
      ).first()
      expect(idArg).toBe('testId')
      expect(optionsArg).toBeUndefined()
      verify(mockAppSync.rescanVirtualPresence(anything(), anything())).once()
    })

    it('calls appsync with options and returns result correctly', async () => {
      when(
        mockAppSync.rescanVirtualPresence(anything(), anything()),
      ).thenResolve(GraphQLDataFactory.virtualPresence)

      const options = {
        maximumItemsProcessed: 100,
        earliestScanDate: '2026-01-01',
        latestScanDate: '2026-06-01',
        excludeDomains: ['spam.com'],
        excludeCategories: ['newsletters'],
      }
      const result = await instanceUnderTest.rescan({ id: 'testId', options })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [idArg, optionsArg] = capture(
        mockAppSync.rescanVirtualPresence,
      ).first()
      expect(idArg).toBe('testId')
      expect(optionsArg).toStrictEqual(options)
      verify(mockAppSync.rescanVirtualPresence(anything(), anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(
        mockAppSync.rescanVirtualPresence(anything(), anything()),
      ).thenReject(new Error('rescan failed'))

      await expect(instanceUnderTest.rescan({ id: 'testId' })).rejects.toThrow(
        'rescan failed',
      )
      verify(mockAppSync.rescanVirtualPresence(anything(), anything())).once()
    })
  })

  describe('disconnect', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.disconnectVirtualPresence(anything())).thenResolve(
        GraphQLDataFactory.virtualPresence,
      )

      const result = await instanceUnderTest.disconnect('testId')

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [idArg] = capture(mockAppSync.disconnectVirtualPresence).first()
      expect(idArg).toBe('testId')
      verify(mockAppSync.disconnectVirtualPresence(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.disconnectVirtualPresence(anything())).thenReject(
        new Error('disconnect failed'),
      )

      await expect(instanceUnderTest.disconnect('testId')).rejects.toThrow(
        'disconnect failed',
      )
      verify(mockAppSync.disconnectVirtualPresence(anything())).once()
    })
  })

  describe('rescan', () => {
    it('calls appSync rescanVirtualPresence and returns transformed entity', async () => {
      when(
        mockAppSync.rescanVirtualPresence(anything(), anything()),
      ).thenResolve(GraphQLDataFactory.virtualPresence)

      const result = await instanceUnderTest.rescan({ id: 'testId' })

      expect(result).toStrictEqual(EntityDataFactory.virtualPresence)
      const [idArg, optionsArg] = capture(
        mockAppSync.rescanVirtualPresence,
      ).first()
      expect(idArg).toBe('testId')
      expect(optionsArg).toBeUndefined()
      verify(mockAppSync.rescanVirtualPresence(anything(), anything())).once()
    })

    it('passes options to appSync correctly', async () => {
      when(
        mockAppSync.rescanVirtualPresence(anything(), anything()),
      ).thenResolve(GraphQLDataFactory.virtualPresence)

      const options = {
        maximumItemsProcessed: 100,
        earliestScanDate: '2026-01-01',
        latestScanDate: '2026-06-01',
        excludeDomains: ['spam.com'],
        excludeCategories: ['newsletters'],
      }

      await instanceUnderTest.rescan({ id: 'testId', options })

      const [, optionsArg] = capture(mockAppSync.rescanVirtualPresence).first()
      expect(optionsArg).toStrictEqual(options)
    })

    it('throws error when appSync throws', async () => {
      when(
        mockAppSync.rescanVirtualPresence(anything(), anything()),
      ).thenReject(new Error('rescan failed'))

      await expect(instanceUnderTest.rescan({ id: 'testId' })).rejects.toThrow(
        'rescan failed',
      )
      verify(mockAppSync.rescanVirtualPresence(anything(), anything())).once()
    })
  })

  describe('subscribe', () => {
    const mockVirtualPresenceSubscriber: VirtualPresenceSubscriber = {
      virtualPresenceUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }

    it('calls appsync subscription and registers subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onVirtualPresenceUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockVirtualPresenceSubscriber,
      })

      verify(mockAppSync.onVirtualPresenceUpdated('testOwner')).once()
      expect(
        mockVirtualPresenceSubscriber.connectionStatusChanged,
      ).toHaveBeenCalledWith(ConnectionState.Connected)
    })

    it('does not create a new watcher on second subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onVirtualPresenceUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      const mockVirtualPresenceSubscriber2 = mock<VirtualPresenceSubscriber>()

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockVirtualPresenceSubscriber,
      })
      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-2',
        owner: 'testOwner',
        subscriber: mockVirtualPresenceSubscriber2,
      })

      verify(mockAppSync.onVirtualPresenceUpdated(anything())).once()
    })

    it('throws error when appSync subscription fails', async () => {
      when(mockAppSync.onVirtualPresenceUpdated(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.subscribe({
          subscriptionId: 'sub-1',
          owner: 'testOwner',
          subscriber: mockVirtualPresenceSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })

  describe('unsubscribe', () => {
    const mockVirtualPresenceSubscriber = mock<VirtualPresenceSubscriber>()

    it('unsubscribes by subscription ID', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onVirtualPresenceUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockVirtualPresenceSubscriber,
      })

      instanceUnderTest.unsubscribe('sub-1')
    })
  })
})
