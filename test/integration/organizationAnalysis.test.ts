/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import waitForExpect from 'wait-for-expect'
import {
  AnalysisResultStatus,
  OrganizationAnalysis,
  OrganizationAnalysisMode,
  SudoPrivacyInteractionClient,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'

describe('Organization Analysis Integration Test Suite', () => {
  const log = new DefaultLogger('OrganizationAnalysisIntegrationTest')

  const testDomain = 'spotify.com'

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient

  beforeEach(async () => {
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient
  })

  afterEach(async () => {
    await userClient.reset()
  })

  /**
   * Asserts the common shape of an organization analysis for a given domain.
   */
  const expectValidAnalysis = (
    analysis: OrganizationAnalysis,
    domain: string,
  ): void => {
    expect(analysis.id).toBe(domain)
    expect(analysis.domain).toBe(domain)
    expect(Object.values(AnalysisResultStatus)).toContain(analysis.status)
    expect(analysis.lastAnalyzedAt).toBeInstanceOf(Date)
    expect(analysis.owner).toBeDefined()
    expect(typeof analysis.version).toBe('number')
    expect(analysis.createdAt).toBeInstanceOf(Date)
    expect(analysis.updatedAt).toBeInstanceOf(Date)

    // When terminal-complete, the structured payload should be populated.
    if (
      analysis.status === AnalysisResultStatus.Complete ||
      analysis.status === AnalysisResultStatus.Partial
    ) {
      expect(analysis.data).toBeDefined()
      expect(analysis.data?.privacySummary).toBeDefined()
      expect(Array.isArray(analysis.data?.categories)).toBe(true)
      expect(analysis.data?.capabilities).toBeDefined()
      expect(analysis.data?.riskIndicators).toBeDefined()
      expect(Array.isArray(analysis.data?.attribution)).toBe(true)

      // Privacy score, when present, carries scoring coverage.
      if (analysis.data?.privacyScore) {
        expect(typeof analysis.data.privacyScore.score).toBe('number')
        expect(Array.isArray(analysis.data.privacyScore.breakdown)).toBe(true)
        expect(analysis.data.privacyScore.coverage).toBeDefined()
        expect(typeof analysis.data.privacyScore.coverage.evaluated).toBe(
          'number',
        )
        expect(typeof analysis.data.privacyScore.coverage.total).toBe('number')
      }
    }
  }

  describe('getOrganizationAnalysis', () => {
    it('analyzes a domain and returns a terminal result, then fetches it', async () => {
      // ANALYZE (read-through). The result may be PENDING while asynchronous
      // sources resolve; re-query until it reaches a terminal status.
      const initial = await instanceUnderTest.getOrganizationAnalysis({
        domain: testDomain,
        mode: OrganizationAnalysisMode.Analyze,
      })
      expect(initial).toBeDefined()
      expectValidAnalysis(initial!, testDomain)

      await waitForExpect(
        async () => {
          const analysis = await instanceUnderTest.getOrganizationAnalysis({
            domain: testDomain,
            mode: OrganizationAnalysisMode.Analyze,
          })
          expect(analysis).toBeDefined()
          expect(analysis?.status).not.toBe(AnalysisResultStatus.Pending)
        },
        120000,
        5000,
      )

      // FETCH subsequently — the analysis produced above should now be
      // retrievable via the fetch-only mode.
      const fetched = await instanceUnderTest.getOrganizationAnalysis({
        domain: testDomain,
        mode: OrganizationAnalysisMode.Fetch,
      })
      expect(fetched).toBeDefined()
      expectValidAnalysis(fetched!, testDomain)
    })

    it('defaults to analyze behaviour when mode is omitted', async () => {
      const analysis = await instanceUnderTest.getOrganizationAnalysis({
        domain: testDomain,
      })

      expect(analysis).toBeDefined()
      expectValidAnalysis(analysis!, testDomain)
    })
  })
})
