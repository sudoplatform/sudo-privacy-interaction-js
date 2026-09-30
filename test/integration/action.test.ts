/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { v4 } from 'uuid'
import waitForExpect from 'wait-for-expect'
import {
  Action,
  ActionFulfilmentMethod,
  ActionIntent,
  ActionOrigin,
  ActionStatus,
  AvailableAction,
  ConnectionState,
  RelationshipProvider,
  SudoPrivacyInteractionClient,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'
import {
  isTestProviderEnabled,
  resolveRelationshipProvider,
} from './util/relationshipProvider'
import { TestAdminClient } from './util/testAdminClient'

describe('Action Integration Test Suite', () => {
  const log = new DefaultLogger('ActionIntegrationTest')

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient
  let relationshipProvider: RelationshipProvider
  let testAdminClient: TestAdminClient

  // Resolved once against a throwaway client. This suite depends on the TEST
  // provider to seed data holders with known actions, so every test is skipped
  // when the TEST provider is not enabled for the environment.
  let testProviderEnabled = false

  const connectedIds = new Set<string>()
  const seededEmailIds = new Set<string>()

  /**
   * Seeds a test email (via the admin API) with a `List-Unsubscribe` header for
   * the current signed-in user against the given account email address. The
   * unsubscribe header drives discovery to surface a data holder with a known
   * `STOP_CONTACT` available action.
   */
  const seedUnsubscribableEmail = async (
    emailAddress: string,
  ): Promise<void> => {
    const created = await testAdminClient.createTestEmails([
      {
        owner: setup.owner,
        emailAddress,
        from: 'Netflix <info@netflix.com>',
        internalDateEpochMs: Date.now(),
        labelIds: ['INBOX'],
        listUnsubscribeHeader:
          '<mailto:unsubscribe@netflix.com>, <https://netflix.com/unsubscribe>',
        listUnsubscribePostHeader: 'List-Unsubscribe=One-Click',
        subject: 'Your Netflix receipt',
      },
    ])
    for (const email of created) {
      seededEmailIds.add(email.id)
    }
  }

  /**
   * Connects a virtual presence via the TEST provider and waits for discovery to
   * surface at least one data holder, returning the first discovered data holder
   * id along with the connected virtual presence id.
   */
  const connectAndDiscoverDataHolder = async (
    providerIdentity: string,
  ): Promise<{ virtualPresenceId: string; dataHolderId: string }> => {
    await seedUnsubscribableEmail(providerIdentity)
    const connectedVp =
      await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
        refreshToken: 'test-refresh-token',
        providerIdentity,
        relationshipProvider,
      })
    connectedIds.add(connectedVp.id)

    let dataHolderId: string | undefined
    await waitForExpect(
      async () => {
        const result = await instanceUnderTest.listDataHolders({
          virtualPresenceId: connectedVp.id,
        })
        expect(result.items.length).toBeGreaterThan(0)
        dataHolderId = result.items[0].id
      },
      60000,
      3000,
    )

    return { virtualPresenceId: connectedVp.id, dataHolderId: dataHolderId! }
  }

  beforeAll(async () => {
    // One-time probe to decide whether the TEST provider is enabled. Uses a
    // dedicated client that is torn down immediately afterwards.
    const probe = await setupPrivacyInteractionClient(log)
    try {
      testProviderEnabled = await isTestProviderEnabled(
        probe.privacyInteractionClient,
      )
      if (!testProviderEnabled) {
        log.info(
          'TEST provider not enabled; Action integration tests will be skipped.',
        )
      }
    } finally {
      await probe.userClient.reset()
    }
  })

  beforeEach(async () => {
    if (!testProviderEnabled) {
      return
    }
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient
    relationshipProvider = await resolveRelationshipProvider(instanceUnderTest)
    testAdminClient = new TestAdminClient()
  })

  afterEach(async () => {
    if (!testProviderEnabled) {
      return
    }
    for (const id of connectedIds) {
      try {
        await instanceUnderTest.disconnectVirtualPresence(id)
      } catch (err) {
        log.debug('Cleanup disconnect failed (may already be disconnected)', {
          id,
          err,
        })
      }
    }
    connectedIds.clear()

    if (seededEmailIds.size > 0) {
      try {
        await testAdminClient.deleteTestEmails([...seededEmailIds])
      } catch (err) {
        log.debug('Cleanup of seeded test emails failed', { err })
      }
      seededEmailIds.clear()
    }

    await userClient.reset()
  })

  describe('listAvailableActions', () => {
    it('returns a known STOP_CONTACT action for a seeded data holder', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const { dataHolderId } = await connectAndDiscoverDataHolder(
        'action-list-available@example.com',
      )

      // The seeded List-Unsubscribe header should yield a discovery-derived
      // STOP_CONTACT action once analysis has run for the data holder.
      let availableActions: AvailableAction[] = []
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listAvailableActions({
            dataHolderId,
          })
          availableActions = result.items
          expect(
            availableActions.some(
              (action) => action.intent === ActionIntent.StopContact,
            ),
          ).toBe(true)
        },
        60000,
        3000,
      )

      const stopContact = availableActions.find(
        (action) => action.intent === ActionIntent.StopContact,
      )!
      expect(Object.values(ActionFulfilmentMethod)).toContain(
        stopContact.fulfilmentMethod,
      )
      expect(Object.values(ActionOrigin)).toContain(stopContact.origin)
    })

    it('returns an empty list for a data holder with no actions', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const result = await instanceUnderTest.listAvailableActions({
        dataHolderId: 'non-existent-data-holder-id',
      })

      expect(result).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
      expect(result.items.length).toBe(0)
    })
  })

  describe('initiateAction', () => {
    it('initiates a STOP_CONTACT assisted action against a seeded data holder', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const { virtualPresenceId, dataHolderId } =
        await connectAndDiscoverDataHolder('action-initiate@example.com')

      let stopContact: AvailableAction | undefined
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listAvailableActions({
            dataHolderId,
          })
          stopContact = result.items.find(
            (action) => action.intent === ActionIntent.StopContact,
          )
          expect(stopContact).toBeDefined()
        },
        60000,
        3000,
      )

      const action = await instanceUnderTest.initiateAction({
        dataHolderId,
        intent: ActionIntent.StopContact,
        fulfilmentMethod: stopContact!.fulfilmentMethod,
      })

      expect(action.id).toBeDefined()
      expect(action.virtualPresenceId).toBe(virtualPresenceId)
      expect(action.dataHolderId).toBe(dataHolderId)
      expect(action.intent).toBe(ActionIntent.StopContact)
      expect(action.fulfilmentMethod).toBe(stopContact!.fulfilmentMethod)
      expect(Object.values(ActionStatus)).toContain(action.status)
      expect(action.owner).toBeDefined()
      expect(typeof action.version).toBe('number')
      expect(action.createdAt).toBeInstanceOf(Date)
      expect(action.updatedAt).toBeInstanceOf(Date)

      // An assisted action must carry materials for the client to complete it.
      if (action.fulfilmentMethod === ActionFulfilmentMethod.Assisted) {
        expect(action.assistedPayload).toBeDefined()
      }
    })
  })

  describe('action subscriptions', () => {
    it('successfully subscribes and receives connected state', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected
      let connectionStateChangeCalled = false

      await instanceUnderTest.subscribeToActions(subscriptionId, {
        actionUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionStateChangeCalled = true
          connectionState = state
        },
      })

      expect(connectionStateChangeCalled).toBeTruthy()
      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromActions(subscriptionId)
    })

    it('does not notify after unsubscribing', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const subscriptionId = v4()
      let updateCalled = false

      await instanceUnderTest.subscribeToActions(subscriptionId, {
        actionUpdated(): void {
          updateCalled = true
        },
        connectionStatusChanged(): void {},
      })

      instanceUnderTest.unsubscribeFromActions(subscriptionId)

      // Drive discovery + initiate an action; no notification should arrive.
      const { dataHolderId } = await connectAndDiscoverDataHolder(
        'action-sub-unsub@example.com',
      )
      let stopContact: AvailableAction | undefined
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listAvailableActions({
            dataHolderId,
          })
          stopContact = result.items.find(
            (action) => action.intent === ActionIntent.StopContact,
          )
          expect(stopContact).toBeDefined()
        },
        60000,
        3000,
      )
      await instanceUnderTest.initiateAction({
        dataHolderId,
        intent: ActionIntent.StopContact,
        fulfilmentMethod: stopContact!.fulfilmentMethod,
      })

      await waitForExpect(() => {
        expect(updateCalled).toBeFalsy()
      })
    })

    it('supports multiple subscribers without error', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const subscriptionId1 = v4()
      const subscriptionId2 = v4()
      let subscriber1Connected = false

      await instanceUnderTest.subscribeToActions(subscriptionId1, {
        actionUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber1Connected = true
          }
        },
      })

      await instanceUnderTest.subscribeToActions(subscriptionId2, {
        actionUpdated(): void {},
        connectionStatusChanged(): void {},
      })

      expect(subscriber1Connected).toBeTruthy()

      instanceUnderTest.unsubscribeFromActions(subscriptionId1)
      instanceUnderTest.unsubscribeFromActions(subscriptionId2)
    })

    it('receives an action status update after initiating an action', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const subscriptionId = v4()
      const receivedActions: Action[] = []
      let connectionState: ConnectionState = ConnectionState.Disconnected

      await instanceUnderTest.subscribeToActions(subscriptionId, {
        actionUpdated(action: Action): void {
          receivedActions.push(action)
        },
        connectionStatusChanged(state: ConnectionState): void {
          connectionState = state
        },
      })

      expect(connectionState).toBe(ConnectionState.Connected)

      // Small delay to ensure the subscription is established.
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const { dataHolderId } = await connectAndDiscoverDataHolder(
        'action-status-sub@example.com',
      )
      let stopContact: AvailableAction | undefined
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listAvailableActions({
            dataHolderId,
          })
          stopContact = result.items.find(
            (action) => action.intent === ActionIntent.StopContact,
          )
          expect(stopContact).toBeDefined()
        },
        60000,
        3000,
      )

      const initiated = await instanceUnderTest.initiateAction({
        dataHolderId,
        intent: ActionIntent.StopContact,
        fulfilmentMethod: stopContact!.fulfilmentMethod,
      })

      // Wait for a status update for the initiated action to be published.
      await waitForExpect(
        () => {
          expect(
            receivedActions.some((action) => action.id === initiated.id),
          ).toBe(true)
        },
        60000,
        3000,
      )

      const update = receivedActions.find(
        (action) => action.id === initiated.id,
      )!
      expect(update.intent).toBe(ActionIntent.StopContact)
      expect(Object.values(ActionStatus)).toContain(update.status)
      expect(update.owner).toBeDefined()
      expect(update.createdAt).toBeInstanceOf(Date)
      expect(update.updatedAt).toBeInstanceOf(Date)

      instanceUnderTest.unsubscribeFromActions(subscriptionId)
    })
  })

  describe('confirmActionOutcome', () => {
    it('confirms an action once it reaches COMPLETED_UNVERIFIED via the status subscription', async (ctx) => {
      if (!testProviderEnabled) {
        ctx.skip()
        return
      }

      const subscriptionId = v4()
      const receivedActions: Action[] = []
      let connectionState: ConnectionState = ConnectionState.Disconnected

      await instanceUnderTest.subscribeToActions(subscriptionId, {
        actionUpdated(action: Action): void {
          receivedActions.push(action)
        },
        connectionStatusChanged(state: ConnectionState): void {
          connectionState = state
        },
      })

      expect(connectionState).toBe(ConnectionState.Connected)

      // Small delay to ensure the subscription is established.
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const { dataHolderId } = await connectAndDiscoverDataHolder(
        'action-confirm@example.com',
      )
      let stopContact: AvailableAction | undefined
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listAvailableActions({
            dataHolderId,
          })
          stopContact = result.items.find(
            (action) => action.intent === ActionIntent.StopContact,
          )
          expect(stopContact).toBeDefined()
        },
        60000,
        3000,
      )

      const initiated = await instanceUnderTest.initiateAction({
        dataHolderId,
        intent: ActionIntent.StopContact,
        fulfilmentMethod: stopContact!.fulfilmentMethod,
      })

      // Wait for the action to progress to COMPLETED_UNVERIFIED. Progression is
      // driven by the service and surfaced via the status subscription, so we
      // observe it there rather than polling.
      await waitForExpect(
        () => {
          expect(
            receivedActions.some(
              (action) =>
                action.id === initiated.id &&
                action.status === ActionStatus.CompletedUnverified,
            ),
          ).toBe(true)
        },
        120000,
        3000,
      )

      // Confirm the outcome; the action should transition to COMPLETED_VERIFIED.
      const confirmed = await instanceUnderTest.confirmActionOutcome(
        initiated.id,
      )

      expect(confirmed.id).toBe(initiated.id)
      expect(confirmed.status).toBe(ActionStatus.CompletedVerified)
      expect(confirmed.intent).toBe(ActionIntent.StopContact)
      expect(confirmed.updatedAt).toBeInstanceOf(Date)

      // The confirmation should itself be published to the status subscription.
      await waitForExpect(
        () => {
          expect(
            receivedActions.some(
              (action) =>
                action.id === initiated.id &&
                action.status === ActionStatus.CompletedVerified,
            ),
          ).toBe(true)
        },
        60000,
        3000,
      )

      instanceUnderTest.unsubscribeFromActions(subscriptionId)
    })
  })
})
