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
import { DefaultActionService } from '../../../../../src/private/data/action/defaultActionService'
import { ApiClient } from '../../../../../src/private/data/common/apiClient'
import {
  ActionFulfilmentMethodEntity,
  ActionIntentEntity,
} from '../../../../../src/private/domain/entities/action/actionEntity'
import { ActionSubscriber, ConnectionState } from '../../../../../src/public'
import { EntityDataFactory } from '../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../data-factory/graphQL'

describe('DefaultActionService Test Suite', () => {
  const mockAppSync = mock<ApiClient>()

  let instanceUnderTest: DefaultActionService

  beforeEach(() => {
    reset(mockAppSync)
    instanceUnderTest = new DefaultActionService(instance(mockAppSync))
  })

  describe('initiate', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.initiateAction(anything())).thenResolve(
        GraphQLDataFactory.action,
      )

      const result = await instanceUnderTest.initiate({
        dataHolderId: 'testDataHolderId',
        intent: ActionIntentEntity.StopContact,
        fulfilmentMethod: ActionFulfilmentMethodEntity.Assisted,
      })

      expect(result).toStrictEqual(EntityDataFactory.action)
      const [inputArg] = capture(mockAppSync.initiateAction).first()
      expect(inputArg).toStrictEqual({
        dataHolderId: 'testDataHolderId',
        intent: 'STOP_CONTACT',
        fulfilmentMethod: 'ASSISTED',
      })
      verify(mockAppSync.initiateAction(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.initiateAction(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(
        instanceUnderTest.initiate({
          dataHolderId: 'testDataHolderId',
          intent: ActionIntentEntity.StopContact,
          fulfilmentMethod: ActionFulfilmentMethodEntity.Assisted,
        }),
      ).rejects.toThrow('GraphQL error')
      verify(mockAppSync.initiateAction(anything())).once()
    })
  })

  describe('confirmOutcome', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.confirmActionOutcome(anything())).thenResolve(
        GraphQLDataFactory.action,
      )

      const result = await instanceUnderTest.confirmOutcome('testId')

      expect(result).toStrictEqual(EntityDataFactory.action)
      const [idArg] = capture(mockAppSync.confirmActionOutcome).first()
      expect(idArg).toBe('testId')
      verify(mockAppSync.confirmActionOutcome(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.confirmActionOutcome(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(instanceUnderTest.confirmOutcome('testId')).rejects.toThrow(
        'GraphQL error',
      )
      verify(mockAppSync.confirmActionOutcome(anything())).once()
    })
  })

  describe('listAvailable', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.listAvailableActions(anything())).thenResolve({
        items: [GraphQLDataFactory.availableAction],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.listAvailable({
        dataHolderId: 'testDataHolderId',
      })

      expect(result).toStrictEqual({
        availableActions: [EntityDataFactory.availableAction],
        nextToken: 'nextToken',
      })
      const [inputArg] = capture(mockAppSync.listAvailableActions).first()
      expect(inputArg).toStrictEqual({ dataHolderId: 'testDataHolderId' })
      verify(mockAppSync.listAvailableActions(anything())).once()
    })

    it('returns empty list when appSync returns no items', async () => {
      when(mockAppSync.listAvailableActions(anything())).thenResolve({
        items: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.listAvailable({
        dataHolderId: 'testDataHolderId',
      })

      expect(result).toStrictEqual({
        availableActions: [],
        nextToken: undefined,
      })
      verify(mockAppSync.listAvailableActions(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.listAvailableActions(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(
        instanceUnderTest.listAvailable({ dataHolderId: 'testDataHolderId' }),
      ).rejects.toThrow('GraphQL error')
      verify(mockAppSync.listAvailableActions(anything())).once()
    })
  })

  describe('subscribe', () => {
    const mockActionSubscriber: ActionSubscriber = {
      actionUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }

    it('calls appsync subscription and registers subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onActionStatusUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockActionSubscriber,
      })

      verify(mockAppSync.onActionStatusUpdated('testOwner')).once()
      expect(mockActionSubscriber.connectionStatusChanged).toHaveBeenCalledWith(
        ConnectionState.Connected,
      )
    })

    it('does not create a new watcher on second subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onActionStatusUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      const mockActionSubscriber2 = mock<ActionSubscriber>()

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockActionSubscriber,
      })
      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-2',
        owner: 'testOwner',
        subscriber: mockActionSubscriber2,
      })

      verify(mockAppSync.onActionStatusUpdated(anything())).once()
    })

    it('throws error when appSync subscription fails', async () => {
      when(mockAppSync.onActionStatusUpdated(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.subscribe({
          subscriptionId: 'sub-1',
          owner: 'testOwner',
          subscriber: mockActionSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })

  describe('unsubscribe', () => {
    const mockActionSubscriber = mock<ActionSubscriber>()

    it('unsubscribes by subscription ID', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onActionStatusUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: instance(mockActionSubscriber),
      })

      instanceUnderTest.unsubscribe('sub-1')
    })
  })
})
