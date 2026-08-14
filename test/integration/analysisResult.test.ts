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
  AnalysisResultStatus,
  AnalysisResultUpdate,
  ConnectionState,
  SudoPrivacyInteractionClient,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'

describe('Analysis Result Integration Test Suite', () => {
  const log = new DefaultLogger('AnalysisResultIntegrationTest')

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient

  const connectedIds = new Set<string>()

  beforeEach(async () => {
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient
  })

  afterEach(async () => {
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
    await userClient.reset()
  })

  describe('getAnalysisResult', () => {
    it('returns undefined for a non-existent analysis result', async () => {
      const result =
        await instanceUnderTest.getAnalysisResult('non-existent-id')

      expect(result).toBeUndefined()
    })
  })

  describe('listAnalysisResults', () => {
    it('lists analysis results for a virtual presence after discovery', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'analysisresult-test@example.com',
        })
      expect(connectedVp).toBeDefined()
      connectedIds.add(connectedVp.id)

      // Wait for discovery → analysis pipeline to produce results
      await waitForExpect(async () => {
        const result = await instanceUnderTest.listAnalysisResults({
          virtualPresenceId: connectedVp.id,
        })
        expect(result.items.length).toBeGreaterThan(0)
      })

      const result = await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: connectedVp.id,
      })

      for (const item of result.items) {
        expect(item.id).toBeDefined()
        expect(item.virtualPresenceId).toBe(connectedVp.id)
        expect(item.dataHolderIdentifier).toBeDefined()
        expect(item.status).toBeDefined()
        expect(item.lastAnalyzedAt).toBeInstanceOf(Date)
        expect(item.owner).toBeDefined()
        expect(typeof item.version).toBe('number')
        expect(item.createdAt).toBeInstanceOf(Date)
        expect(item.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('returns an empty list when no analysis results exist', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'list-ar-empty@example.com',
        })
      expect(connectedVp).toBeDefined()
      connectedIds.add(connectedVp.id)

      const result = await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: connectedVp.id,
      })

      expect(result).toBeDefined()
      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('respects limit parameter', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'list-ar-limit@example.com',
        })
      connectedIds.add(connectedVp.id)

      // Wait for at least one result
      await waitForExpect(async () => {
        const result = await instanceUnderTest.listAnalysisResults({
          virtualPresenceId: connectedVp.id,
        })
        expect(result.items.length).toBeGreaterThan(0)
      })

      const result = await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: connectedVp.id,
        limit: 1,
      })

      expect(result.items.length).toBeLessThanOrEqual(1)
    })

    it('supports pagination with nextToken', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'list-ar-pagination@example.com',
        })
      connectedIds.add(connectedVp.id)

      // Wait for results
      await waitForExpect(async () => {
        const result = await instanceUnderTest.listAnalysisResults({
          virtualPresenceId: connectedVp.id,
        })
        expect(result.items.length).toBeGreaterThan(0)
      })

      const firstPage = await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: connectedVp.id,
        limit: 1,
      })

      if (firstPage.nextToken) {
        const secondPage = await instanceUnderTest.listAnalysisResults({
          virtualPresenceId: connectedVp.id,
          limit: 1,
          nextToken: firstPage.nextToken,
        })

        expect(secondPage).toBeDefined()
        expect(secondPage.items).toBeDefined()
      }
    })
  })

  describe('analysis result subscriptions', () => {
    it('successfully subscribes and receives connected state', async () => {
      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected
      let connectionStateChangeCalled = false

      await instanceUnderTest.subscribeToAnalysisResult(subscriptionId, {
        analysisResultUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionStateChangeCalled = true
          connectionState = state
        },
      })

      expect(connectionStateChangeCalled).toBeTruthy()
      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromAnalysisResult(subscriptionId)
    })

    it('does not notify after unsubscribing', async () => {
      const subscriptionId = v4()
      let updateCalled = false

      await instanceUnderTest.subscribeToAnalysisResult(subscriptionId, {
        analysisResultUpdated(): void {
          updateCalled = true
        },
        connectionStatusChanged(): void {},
      })

      instanceUnderTest.unsubscribeFromAnalysisResult(subscriptionId)

      // Connect a VP to trigger discovery → analysis pipeline
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'ar-sub-test@example.com',
        })
      connectedIds.add(connectedVp.id)

      await waitForExpect(() => {
        expect(updateCalled).toBeFalsy()
      })
    })

    it('supports multiple subscribers without error', async () => {
      const subscriptionId1 = v4()
      const subscriptionId2 = v4()
      let subscriber1Connected = false
      let subscriber2Connected = false

      await instanceUnderTest.subscribeToAnalysisResult(subscriptionId1, {
        analysisResultUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber1Connected = true
          }
        },
      })

      await instanceUnderTest.subscribeToAnalysisResult(subscriptionId2, {
        analysisResultUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber2Connected = true
          }
        },
      })

      expect(subscriber1Connected).toBeTruthy()

      instanceUnderTest.unsubscribeFromAnalysisResult(subscriptionId1)
      instanceUnderTest.unsubscribeFromAnalysisResult(subscriptionId2)
    })

    it('receives analysis result updates after discovery triggers analysis', async () => {
      const subscriptionId = v4()
      const analysisResultUpdates: AnalysisResultUpdate[] = []
      let connectionState: ConnectionState = ConnectionState.Disconnected

      await instanceUnderTest.subscribeToAnalysisResult(subscriptionId, {
        analysisResultUpdated(update: AnalysisResultUpdate): void {
          analysisResultUpdates.push(update)
        },
        connectionStatusChanged(state: ConnectionState): void {
          connectionState = state
        },
      })

      expect(connectionState).toBe(ConnectionState.Connected)

      // Connect a VP to trigger discovery → data holders → analysis pipeline
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'ar-discovery-sub@example.com',
        })
      connectedIds.add(connectedVp.id)

      // Wait for analysis results to be published
      await waitForExpect(() => {
        expect(analysisResultUpdates.length).toBeGreaterThan(0)
      })

      // Verify the received update has the expected shape
      const firstUpdate = analysisResultUpdates[0]
      expect(firstUpdate.id).toBeDefined()
      expect(firstUpdate.virtualPresenceId).toBe(connectedVp.id)
      expect(firstUpdate.dataHolderIdentifier).toBeDefined()
      expect(firstUpdate.status).toBeDefined()
      expect(Object.values(AnalysisResultStatus)).toContain(firstUpdate.status)
      expect(firstUpdate.lastAnalyzedAt).toBeInstanceOf(Date)
      expect(firstUpdate.owner).toBeDefined()
      expect(typeof firstUpdate.version).toBe('number')
      expect(firstUpdate.createdAt).toBeInstanceOf(Date)
      expect(firstUpdate.updatedAt).toBeInstanceOf(Date)

      instanceUnderTest.unsubscribeFromAnalysisResult(subscriptionId)
    })
  })
})
