/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
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
import { v4 } from 'uuid'
import { DefaultAnalysisResultService } from '../../../src/private/data/analysis-result/defaultAnalysisResultService'
import { ApiClient } from '../../../src/private/data/common/apiClient'
import { DefaultProviderConfigurationService } from '../../../src/private/data/provider-configuration/defaultProviderConfigurationService'
import { PrivacyInteractionServiceConfig } from '../../../src/private/data/common/config'
import { PrivateSudoPrivacyInteractionClientOptions } from '../../../src/private/data/common/privateSudoPrivacyInteractionClientOptions'
import { DefaultDataHolderService } from '../../../src/private/data/data-holder/defaultDataHolderService'
import { DefaultVirtualPresenceService } from '../../../src/private/data/virtual-presence/defaultVirtualPresenceService'
import { GetAnalysisResultUseCase } from '../../../src/private/domain/use-cases/analysis-result/getAnalysisResultUseCase'
import { GetOrganizationAnalysisUseCase } from '../../../src/private/domain/use-cases/organization-analysis/getOrganizationAnalysisUseCase'
import { OrganizationAnalysisModeEntity } from '../../../src/private/domain/entities/organization-analysis/organizationAnalysisEntity'
import { GetProviderConfigurationUseCase } from '../../../src/private/domain/use-cases/configuration/getProviderConfigurationUseCase'
import { ListAnalysisResultsUseCase } from '../../../src/private/domain/use-cases/analysis-result/listAnalysisResultsUseCase'
import { SubscribeToAnalysisResultUseCase } from '../../../src/private/domain/use-cases/analysis-result/subscribeToAnalysisResultUseCase'
import { UnsubscribeFromAnalysisResultUseCase } from '../../../src/private/domain/use-cases/analysis-result/unsubscribeFromAnalysisResultUseCase'
import { GetDataHolderUseCase } from '../../../src/private/domain/use-cases/data-holder/getDataHolderUseCase'
import { ListDataHoldersUseCase } from '../../../src/private/domain/use-cases/data-holder/listDataHoldersUseCase'
import { ListDataHolderScanSummariesUseCase } from '../../../src/private/domain/use-cases/data-holder/listDataHolderScanSummariesUseCase'
import { SubscribeToDataHoldersUseCase } from '../../../src/private/domain/use-cases/data-holder/subscribeToDataHoldersUseCase'
import { UnsubscribeFromDataHoldersUseCase } from '../../../src/private/domain/use-cases/data-holder/unsubscribeFromDataHoldersUseCase'
import { ConnectVirtualPresenceWithAuthCodeUseCase } from '../../../src/private/domain/use-cases/virtual-presence/connectVirtualPresenceWithAuthCodeUseCase'
import { ConnectVirtualPresenceWithRefreshTokenUseCase } from '../../../src/private/domain/use-cases/virtual-presence/connectVirtualPresenceWithRefreshTokenUseCase'
import { DisconnectVirtualPresenceUseCase } from '../../../src/private/domain/use-cases/virtual-presence/disconnectVirtualPresenceUseCase'
import { ListVirtualPresencesUseCase } from '../../../src/private/domain/use-cases/virtual-presence/listVirtualPresencesUseCase'
import { RescanVirtualPresenceUseCase } from '../../../src/private/domain/use-cases/virtual-presence/rescanVirtualPresenceUseCase'
import { SubscribeToVirtualPresenceUseCase } from '../../../src/private/domain/use-cases/virtual-presence/subscribeToVirtualPresenceUseCase'
import { UnsubscribeFromVirtualPresenceUseCase } from '../../../src/private/domain/use-cases/virtual-presence/unsubscribeFromVirtualPresenceUseCase'
import { DefaultSudoPrivacyInteractionClient } from '../../../src/public/defaultSudoPrivacyInteractionClient'
import { SudoPrivacyInteractionClient } from '../../../src/public/sudoPrivacyInteractionClient'
import {
  AnalysisResultSubscriber,
  DataHolderSubscriber,
  VirtualPresenceSubscriber,
} from '../../../src/public/typings/subscription'
import { OrganizationAnalysisMode } from '../../../src/public'
import { RelationshipProviderEntity } from '../../../src/private/domain/entities/inputs/relationshipProviderEntity'
import { RelationshipProvider } from '../../../src/public/inputs/virtualPresence'
import { APIDataFactory } from '../../data-factory/api'
import { EntityDataFactory } from '../../data-factory/entity'

// MARK: Service mocks

vi.mock('../../../src/private/data/common/apiClient')
const ViMockApiClient = vi.mocked(ApiClient)

vi.mock(
  '../../../src/private/data/virtual-presence/defaultVirtualPresenceService',
)
const ViMockDefaultVirtualPresenceService = vi.mocked(
  DefaultVirtualPresenceService,
)
vi.mock('../../../src/private/data/data-holder/defaultDataHolderService')
const ViMockDefaultDataHolderService = vi.mocked(DefaultDataHolderService)

vi.mock(
  '../../../src/private/data/analysis-result/defaultAnalysisResultService',
)
const ViMockDefaultAnalysisResultService = vi.mocked(
  DefaultAnalysisResultService,
)

vi.mock(
  '../../../src/private/data/provider-configuration/defaultProviderConfigurationService',
)
const ViMockDefaultProviderConfigurationService = vi.mocked(
  DefaultProviderConfigurationService,
)

// MARK: Use case mocks

vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/connectVirtualPresenceWithAuthCodeUseCase',
)
const ViMockConnectVirtualPresenceWithAuthCodeUseCase = vi.mocked(
  ConnectVirtualPresenceWithAuthCodeUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/connectVirtualPresenceWithRefreshTokenUseCase',
)
const ViMockConnectVirtualPresenceWithRefreshTokenUseCase = vi.mocked(
  ConnectVirtualPresenceWithRefreshTokenUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/disconnectVirtualPresenceUseCase',
)
const ViMockDisconnectVirtualPresenceUseCase = vi.mocked(
  DisconnectVirtualPresenceUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/listVirtualPresencesUseCase',
)
const ViMockListVirtualPresencesUseCase = vi.mocked(ListVirtualPresencesUseCase)
vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/rescanVirtualPresenceUseCase',
)
const ViMockRescanVirtualPresenceUseCase = vi.mocked(
  RescanVirtualPresenceUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/data-holder/getDataHolderUseCase',
)
vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/subscribeToVirtualPresenceUseCase',
)
const ViMockSubscribeToVirtualPresenceUseCase = vi.mocked(
  SubscribeToVirtualPresenceUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/virtual-presence/unsubscribeFromVirtualPresenceUseCase',
)
const ViMockUnsubscribeFromVirtualPresenceUseCase = vi.mocked(
  UnsubscribeFromVirtualPresenceUseCase,
)
const ViMockGetDataHolderUseCase = vi.mocked(GetDataHolderUseCase)
vi.mock(
  '../../../src/private/domain/use-cases/data-holder/listDataHoldersUseCase',
)
const ViMockListDataHoldersUseCase = vi.mocked(ListDataHoldersUseCase)
vi.mock(
  '../../../src/private/domain/use-cases/data-holder/listDataHolderScanSummariesUseCase',
)
const ViMockListDataHolderScanSummariesUseCase = vi.mocked(
  ListDataHolderScanSummariesUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/data-holder/subscribeToDataHoldersUseCase',
)
const ViMockSubscribeToDataHoldersUseCase = vi.mocked(
  SubscribeToDataHoldersUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/data-holder/unsubscribeFromDataHoldersUseCase',
)
const ViMockUnsubscribeFromDataHoldersUseCase = vi.mocked(
  UnsubscribeFromDataHoldersUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/analysis-result/getAnalysisResultUseCase',
)
const ViMockGetAnalysisResultUseCase = vi.mocked(GetAnalysisResultUseCase)
vi.mock(
  '../../../src/private/domain/use-cases/organization-analysis/getOrganizationAnalysisUseCase',
)
const ViMockGetOrganizationAnalysisUseCase = vi.mocked(
  GetOrganizationAnalysisUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/configuration/getProviderConfigurationUseCase',
)
const ViMockGetProviderConfigurationUseCase = vi.mocked(
  GetProviderConfigurationUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/analysis-result/listAnalysisResultsUseCase',
)
const ViMockListAnalysisResultsUseCase = vi.mocked(ListAnalysisResultsUseCase)
vi.mock(
  '../../../src/private/domain/use-cases/analysis-result/subscribeToAnalysisResultUseCase',
)
const ViMockSubscribeToAnalysisResultUseCase = vi.mocked(
  SubscribeToAnalysisResultUseCase,
)
vi.mock(
  '../../../src/private/domain/use-cases/analysis-result/unsubscribeFromAnalysisResultUseCase',
)
const ViMockUnsubscribeFromAnalysisResultUseCase = vi.mocked(
  UnsubscribeFromAnalysisResultUseCase,
)

// MARK: Test suite

describe('DefaultSudoPrivacyInteractionClient Test Suite', () => {
  const mockSudoUserClient = mock<SudoUserClient>()
  const mockApiClient = mock<ApiClient>()

  const mockVirtualPresenceService = mock<DefaultVirtualPresenceService>()
  const mockDataHolderService = mock<DefaultDataHolderService>()
  const mockAnalysisResultService = mock<DefaultAnalysisResultService>()
  const mockProviderConfigurationService =
    mock<DefaultProviderConfigurationService>()

  const mockConnectVirtualPresenceWithAuthCodeUseCase =
    mock<ConnectVirtualPresenceWithAuthCodeUseCase>()
  const mockConnectVirtualPresenceWithRefreshTokenUseCase =
    mock<ConnectVirtualPresenceWithRefreshTokenUseCase>()
  const mockDisconnectVirtualPresenceUseCase =
    mock<DisconnectVirtualPresenceUseCase>()
  const mockListVirtualPresencesUseCase = mock<ListVirtualPresencesUseCase>()
  const mockRescanVirtualPresenceUseCase = mock<RescanVirtualPresenceUseCase>()
  const mockSubscribeToVirtualPresenceUseCase =
    mock<SubscribeToVirtualPresenceUseCase>()
  const mockUnsubscribeFromVirtualPresenceUseCase =
    mock<UnsubscribeFromVirtualPresenceUseCase>()
  const mockGetDataHolderUseCase = mock<GetDataHolderUseCase>()
  const mockListDataHoldersUseCase = mock<ListDataHoldersUseCase>()
  const mockListDataHolderScanSummariesUseCase =
    mock<ListDataHolderScanSummariesUseCase>()
  const mockSubscribeToDataHoldersUseCase =
    mock<SubscribeToDataHoldersUseCase>()
  const mockUnsubscribeFromDataHoldersUseCase =
    mock<UnsubscribeFromDataHoldersUseCase>()
  const mockGetAnalysisResultUseCase = mock<GetAnalysisResultUseCase>()
  const mockGetOrganizationAnalysisUseCase =
    mock<GetOrganizationAnalysisUseCase>()
  const mockGetProviderConfigurationUseCase =
    mock<GetProviderConfigurationUseCase>()
  const mockListAnalysisResultsUseCase = mock<ListAnalysisResultsUseCase>()
  const mockSubscribeToAnalysisResultUseCase =
    mock<SubscribeToAnalysisResultUseCase>()
  const mockUnsubscribeFromAnalysisResultUseCase =
    mock<UnsubscribeFromAnalysisResultUseCase>()

  let instanceUnderTest: SudoPrivacyInteractionClient

  const mockPrivacyInteractionServiceConfig: PrivacyInteractionServiceConfig = {
    region: 'region',
    apiUrl: 'apiUrl',
  }

  // MARK: resetMocks

  const resetMocks = (): void => {
    reset(mockSudoUserClient)
    reset(mockApiClient)

    reset(mockVirtualPresenceService)
    reset(mockDataHolderService)
    reset(mockAnalysisResultService)
    reset(mockProviderConfigurationService)

    reset(mockConnectVirtualPresenceWithAuthCodeUseCase)
    reset(mockConnectVirtualPresenceWithRefreshTokenUseCase)
    reset(mockDisconnectVirtualPresenceUseCase)
    reset(mockListVirtualPresencesUseCase)
    reset(mockRescanVirtualPresenceUseCase)
    reset(mockSubscribeToVirtualPresenceUseCase)
    reset(mockUnsubscribeFromVirtualPresenceUseCase)
    reset(mockGetDataHolderUseCase)
    reset(mockListDataHoldersUseCase)
    reset(mockListDataHolderScanSummariesUseCase)
    reset(mockSubscribeToDataHoldersUseCase)
    reset(mockUnsubscribeFromDataHoldersUseCase)
    reset(mockGetAnalysisResultUseCase)
    reset(mockGetOrganizationAnalysisUseCase)
    reset(mockGetProviderConfigurationUseCase)
    reset(mockListAnalysisResultsUseCase)
    reset(mockSubscribeToAnalysisResultUseCase)
    reset(mockUnsubscribeFromAnalysisResultUseCase)

    ViMockApiClient.mockClear()
    ViMockConnectVirtualPresenceWithAuthCodeUseCase.mockClear()
    ViMockConnectVirtualPresenceWithRefreshTokenUseCase.mockClear()
    ViMockDisconnectVirtualPresenceUseCase.mockClear()
    ViMockListVirtualPresencesUseCase.mockClear()
    ViMockRescanVirtualPresenceUseCase.mockClear()
    ViMockSubscribeToVirtualPresenceUseCase.mockClear()
    ViMockUnsubscribeFromVirtualPresenceUseCase.mockClear()
    ViMockListDataHoldersUseCase.mockClear()
    ViMockListDataHolderScanSummariesUseCase.mockClear()
    ViMockGetDataHolderUseCase.mockClear()
    ViMockSubscribeToDataHoldersUseCase.mockClear()
    ViMockUnsubscribeFromDataHoldersUseCase.mockClear()
    ViMockGetAnalysisResultUseCase.mockClear()
    ViMockGetOrganizationAnalysisUseCase.mockClear()
    ViMockGetProviderConfigurationUseCase.mockClear()
    ViMockListAnalysisResultsUseCase.mockClear()
    ViMockSubscribeToAnalysisResultUseCase.mockClear()
    ViMockUnsubscribeFromAnalysisResultUseCase.mockClear()
  }

  beforeEach(() => {
    resetMocks()

    ViMockApiClient.mockImplementation(function () {
      return instance(mockApiClient)
    })
    ViMockDefaultVirtualPresenceService.mockImplementation(function () {
      return instance(mockVirtualPresenceService)
    })
    ViMockDefaultDataHolderService.mockImplementation(function () {
      return instance(mockDataHolderService)
    })
    ViMockDefaultAnalysisResultService.mockImplementation(function () {
      return instance(mockAnalysisResultService)
    })
    ViMockDefaultProviderConfigurationService.mockImplementation(function () {
      return instance(mockProviderConfigurationService)
    })
    ViMockConnectVirtualPresenceWithAuthCodeUseCase.mockImplementation(
      function () {
        return instance(mockConnectVirtualPresenceWithAuthCodeUseCase)
      },
    )
    ViMockConnectVirtualPresenceWithRefreshTokenUseCase.mockImplementation(
      function () {
        return instance(mockConnectVirtualPresenceWithRefreshTokenUseCase)
      },
    )
    ViMockDisconnectVirtualPresenceUseCase.mockImplementation(function () {
      return instance(mockDisconnectVirtualPresenceUseCase)
    })
    ViMockListVirtualPresencesUseCase.mockImplementation(function () {
      return instance(mockListVirtualPresencesUseCase)
    })
    ViMockRescanVirtualPresenceUseCase.mockImplementation(function () {
      return instance(mockRescanVirtualPresenceUseCase)
    })
    ViMockSubscribeToVirtualPresenceUseCase.mockImplementation(function () {
      return instance(mockSubscribeToVirtualPresenceUseCase)
    })
    ViMockUnsubscribeFromVirtualPresenceUseCase.mockImplementation(function () {
      return instance(mockUnsubscribeFromVirtualPresenceUseCase)
    })
    ViMockGetDataHolderUseCase.mockImplementation(function () {
      return instance(mockGetDataHolderUseCase)
    })
    ViMockListDataHoldersUseCase.mockImplementation(function () {
      return instance(mockListDataHoldersUseCase)
    })
    ViMockListDataHolderScanSummariesUseCase.mockImplementation(function () {
      return instance(mockListDataHolderScanSummariesUseCase)
    })
    ViMockSubscribeToDataHoldersUseCase.mockImplementation(function () {
      return instance(mockSubscribeToDataHoldersUseCase)
    })
    ViMockUnsubscribeFromDataHoldersUseCase.mockImplementation(function () {
      return instance(mockUnsubscribeFromDataHoldersUseCase)
    })
    ViMockGetAnalysisResultUseCase.mockImplementation(function () {
      return instance(mockGetAnalysisResultUseCase)
    })
    ViMockGetOrganizationAnalysisUseCase.mockImplementation(function () {
      return instance(mockGetOrganizationAnalysisUseCase)
    })
    ViMockGetProviderConfigurationUseCase.mockImplementation(function () {
      return instance(mockGetProviderConfigurationUseCase)
    })
    ViMockListAnalysisResultsUseCase.mockImplementation(function () {
      return instance(mockListAnalysisResultsUseCase)
    })
    ViMockSubscribeToAnalysisResultUseCase.mockImplementation(function () {
      return instance(mockSubscribeToAnalysisResultUseCase)
    })
    ViMockUnsubscribeFromAnalysisResultUseCase.mockImplementation(function () {
      return instance(mockUnsubscribeFromAnalysisResultUseCase)
    })

    const options: PrivateSudoPrivacyInteractionClientOptions = {
      sudoUserClient: instance(mockSudoUserClient),
      apiClient: instance(mockApiClient),
      privacyInteractionServiceConfig: mockPrivacyInteractionServiceConfig,
    }

    instanceUnderTest = new DefaultSudoPrivacyInteractionClient(options)
  })

  // MARK: Constructor

  describe('constructor', () => {
    beforeEach(() => {
      resetMocks()
    })
    it('constructs the client correctly', () => {
      DefaultConfigurationManager.getInstance().setConfig(
        JSON.stringify({
          privacyInteractionService: mockPrivacyInteractionServiceConfig,
        }),
      )

      new DefaultSudoPrivacyInteractionClient({
        sudoUserClient: instance(mockSudoUserClient),
      })
      expect(vi.mocked(ApiClient)).toHaveBeenCalledTimes(1)
    })
  })

  // MARK: Configuration

  describe('getProviderConfiguration', () => {
    beforeEach(() => {
      when(mockGetProviderConfigurationUseCase.execute()).thenResolve(
        EntityDataFactory.providerConfigurations,
      )
    })
    it('generates use case', async () => {
      await instanceUnderTest.getProviderConfiguration()
      expect(vi.mocked(GetProviderConfigurationUseCase)).toHaveBeenCalledTimes(
        1,
      )
    })
    it('calls use case', async () => {
      await instanceUnderTest.getProviderConfiguration()
      verify(mockGetProviderConfigurationUseCase.execute()).once()
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.getProviderConfiguration(),
      ).resolves.toStrictEqual(APIDataFactory.providerConfigurations)
    })
    it('throws when use case throws', async () => {
      when(mockGetProviderConfigurationUseCase.execute()).thenReject(
        new Error('config error'),
      )
      await expect(
        instanceUnderTest.getProviderConfiguration(),
      ).rejects.toThrow('config error')
    })
  })

  // MARK: Virtual Presence

  describe('connectVirtualPresenceWithAuthCode', () => {
    beforeEach(() => {
      when(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute(anything()),
      ).thenResolve(EntityDataFactory.virtualPresence)
    })
    it('generates use case', async () => {
      await instanceUnderTest.connectVirtualPresenceWithAuthCode({
        authCode: 'test-auth-code',
      })
      expect(
        vi.mocked(ConnectVirtualPresenceWithAuthCodeUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case with input', async () => {
      await instanceUnderTest.connectVirtualPresenceWithAuthCode({
        authCode: 'test-auth-code',
      })
      verify(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        authCode: 'test-auth-code',
        redirectUri: undefined,
        relationshipProvider: undefined,
      })
    })
    it('calls use case with input including redirectUri', async () => {
      await instanceUnderTest.connectVirtualPresenceWithAuthCode({
        authCode: 'test-auth-code',
        redirectUri: 'https://example.com/callback',
      })
      verify(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        authCode: 'test-auth-code',
        redirectUri: 'https://example.com/callback',
        relationshipProvider: undefined,
      })
    })
    it('calls use case with input including relationshipProvider', async () => {
      await instanceUnderTest.connectVirtualPresenceWithAuthCode({
        authCode: 'test-auth-code',
        relationshipProvider: RelationshipProvider.GmailProvider,
      })
      verify(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        authCode: 'test-auth-code',
        redirectUri: undefined,
        relationshipProvider: RelationshipProviderEntity.GmailProvider,
      })
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.connectVirtualPresenceWithAuthCode({
          authCode: 'test-auth-code',
        }),
      ).resolves.toStrictEqual(APIDataFactory.virtualPresence)
    })
    it('throws when use case throws', async () => {
      when(
        mockConnectVirtualPresenceWithAuthCodeUseCase.execute(anything()),
      ).thenReject(new Error('connect error'))
      await expect(
        instanceUnderTest.connectVirtualPresenceWithAuthCode({
          authCode: 'bad-token',
        }),
      ).rejects.toThrow('connect error')
    })
  })

  describe('connectVirtualPresenceWithRefreshToken', () => {
    beforeEach(() => {
      when(
        mockConnectVirtualPresenceWithRefreshTokenUseCase.execute(anything()),
      ).thenResolve(EntityDataFactory.virtualPresence)
    })
    it('generates use case', async () => {
      const refreshToken = {
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
      }
      await instanceUnderTest.connectVirtualPresenceWithRefreshToken(
        refreshToken,
      )
      expect(
        vi.mocked(ConnectVirtualPresenceWithRefreshTokenUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case with refreshToken', async () => {
      const refreshToken = {
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
        scopes: ['emailAddress'],
      }
      await instanceUnderTest.connectVirtualPresenceWithRefreshToken(
        refreshToken,
      )
      verify(
        mockConnectVirtualPresenceWithRefreshTokenUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockConnectVirtualPresenceWithRefreshTokenUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
        scopes: ['emailAddress'],
        expiresInEpochMs: undefined,
        relationshipProvider: undefined,
      })
    })
    it('calls use case with input including relationshipProvider', async () => {
      await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
        relationshipProvider: RelationshipProvider.TestProvider,
      })
      verify(
        mockConnectVirtualPresenceWithRefreshTokenUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockConnectVirtualPresenceWithRefreshTokenUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
        scopes: undefined,
        expiresInEpochMs: undefined,
        relationshipProvider: RelationshipProviderEntity.TestProvider,
      })
    })
    it('returns expected result', async () => {
      const refreshToken = {
        refreshToken: 'test-refresh-token',
        providerIdentity: 'test@example.com',
      }
      await expect(
        instanceUnderTest.connectVirtualPresenceWithRefreshToken(refreshToken),
      ).resolves.toStrictEqual(APIDataFactory.virtualPresence)
    })
    it('throws when use case throws', async () => {
      when(
        mockConnectVirtualPresenceWithRefreshTokenUseCase.execute(anything()),
      ).thenReject(new Error('connect error'))
      await expect(
        instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'bad-token',
          providerIdentity: 'test@example.com',
        }),
      ).rejects.toThrow('connect error')
    })
  })

  describe('disconnectVirtualPresence', () => {
    beforeEach(() => {
      when(
        mockDisconnectVirtualPresenceUseCase.execute(anything()),
      ).thenResolve(EntityDataFactory.virtualPresence)
    })
    it('generates use case', async () => {
      await instanceUnderTest.disconnectVirtualPresence('testId')
      expect(vi.mocked(DisconnectVirtualPresenceUseCase)).toHaveBeenCalledTimes(
        1,
      )
    })
    it('calls use case with id', async () => {
      await instanceUnderTest.disconnectVirtualPresence('testId')
      verify(mockDisconnectVirtualPresenceUseCase.execute(anything())).once()
      const [idArg] = capture(
        mockDisconnectVirtualPresenceUseCase.execute,
      ).first()
      expect(idArg).toBe('testId')
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.disconnectVirtualPresence('testId'),
      ).resolves.toStrictEqual(APIDataFactory.virtualPresence)
    })
    it('throws when use case throws', async () => {
      when(mockDisconnectVirtualPresenceUseCase.execute(anything())).thenReject(
        new Error('disconnect error'),
      )
      await expect(
        instanceUnderTest.disconnectVirtualPresence('testId'),
      ).rejects.toThrow('disconnect error')
    })
  })

  describe('rescanVirtualPresence', () => {
    beforeEach(() => {
      when(mockRescanVirtualPresenceUseCase.execute(anything())).thenResolve(
        EntityDataFactory.virtualPresence,
      )
    })
    it('generates use case', async () => {
      await instanceUnderTest.rescanVirtualPresence({ id: 'testId' })
      expect(vi.mocked(RescanVirtualPresenceUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case with input', async () => {
      await instanceUnderTest.rescanVirtualPresence({ id: 'testId' })
      verify(mockRescanVirtualPresenceUseCase.execute(anything())).once()
      const [args] = capture(mockRescanVirtualPresenceUseCase.execute).first()
      expect(args).toStrictEqual({ id: 'testId' })
    })
    it('calls use case with options', async () => {
      const input = {
        id: 'testId',
        options: {
          maximumItemsProcessed: 50,
          earliestScanDate: '2026-01-01',
          excludeDomains: ['spam.com'],
        },
      }
      await instanceUnderTest.rescanVirtualPresence(input)
      verify(mockRescanVirtualPresenceUseCase.execute(anything())).once()
      const [args] = capture(mockRescanVirtualPresenceUseCase.execute).first()
      expect(args).toStrictEqual(input)
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.rescanVirtualPresence({ id: 'testId' }),
      ).resolves.toStrictEqual(APIDataFactory.virtualPresence)
    })
    it('throws when use case throws', async () => {
      when(mockRescanVirtualPresenceUseCase.execute(anything())).thenReject(
        new Error('rescan error'),
      )
      await expect(
        instanceUnderTest.rescanVirtualPresence({ id: 'testId' }),
      ).rejects.toThrow('rescan error')
    })
  })

  describe('listVirtualPresences', () => {
    beforeEach(() => {
      when(mockListVirtualPresencesUseCase.execute(anything())).thenResolve({
        virtualPresences: [EntityDataFactory.virtualPresence],
        nextToken: 'nextToken',
      })
    })
    it('generates use case', async () => {
      await instanceUnderTest.listVirtualPresences({})
      expect(vi.mocked(ListVirtualPresencesUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case as expected', async () => {
      const limit = 100
      const nextToken = v4()
      await instanceUnderTest.listVirtualPresences({
        limit,
        nextToken,
      })
      verify(mockListVirtualPresencesUseCase.execute(anything())).once()
      const [args] = capture(mockListVirtualPresencesUseCase.execute).first()
      expect(args).toStrictEqual({
        limit,
        nextToken,
      })
    })
    it('returns empty list if use case result is empty list', async () => {
      when(mockListVirtualPresencesUseCase.execute(anything())).thenResolve({
        virtualPresences: [],
        nextToken: undefined,
      })
      await expect(
        instanceUnderTest.listVirtualPresences({}),
      ).resolves.toStrictEqual({
        items: [],
        nextToken: undefined,
      })
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.listVirtualPresences({}),
      ).resolves.toStrictEqual({
        items: [APIDataFactory.virtualPresence],
        nextToken: 'nextToken',
      })
    })
    it('throws when use case throws', async () => {
      when(mockListVirtualPresencesUseCase.execute(anything())).thenReject(
        new Error('use case error'),
      )
      await expect(instanceUnderTest.listVirtualPresences({})).rejects.toThrow(
        'use case error',
      )
    })
  })

  describe('subscribeToVirtualPresence', () => {
    const mockSubscriber: VirtualPresenceSubscriber = {
      virtualPresenceUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }
    beforeEach(() => {
      when(
        mockSubscribeToVirtualPresenceUseCase.execute(anything()),
      ).thenResolve()
    })
    it('generates use case', async () => {
      await instanceUnderTest.subscribeToVirtualPresence(
        'sub-1',
        mockSubscriber,
      )
      expect(
        vi.mocked(SubscribeToVirtualPresenceUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case with subscriptionId and subscriber', async () => {
      await instanceUnderTest.subscribeToVirtualPresence(
        'sub-1',
        mockSubscriber,
      )
      verify(mockSubscribeToVirtualPresenceUseCase.execute(anything())).once()
      const [args] = capture(
        mockSubscribeToVirtualPresenceUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        subscriptionId: 'sub-1',
        subscriber: mockSubscriber,
      })
    })
    it('throws when use case throws', async () => {
      when(
        mockSubscribeToVirtualPresenceUseCase.execute(anything()),
      ).thenReject(new Error('subscribe error'))
      await expect(
        instanceUnderTest.subscribeToVirtualPresence('sub-1', mockSubscriber),
      ).rejects.toThrow('subscribe error')
    })
  })

  describe('unsubscribeFromVirtualPresence', () => {
    it('generates use case', () => {
      instanceUnderTest.unsubscribeFromVirtualPresence('sub-1')
      expect(
        vi.mocked(UnsubscribeFromVirtualPresenceUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case with subscriptionId', () => {
      instanceUnderTest.unsubscribeFromVirtualPresence('sub-1')
      verify(
        mockUnsubscribeFromVirtualPresenceUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockUnsubscribeFromVirtualPresenceUseCase.execute,
      ).first()
      expect(args).toBe('sub-1')
    })
  })

  // MARK: Data Holder

  describe('getDataHolder', () => {
    beforeEach(() => {
      when(mockGetDataHolderUseCase.execute(anything())).thenResolve(
        EntityDataFactory.dataHolder,
      )
      when(
        mockListDataHolderScanSummariesUseCase.execute(anything()),
      ).thenResolve({
        scanSummaries: [EntityDataFactory.dataHolderScanSummary],
        nextToken: undefined,
      })
    })
    it('generates use case', async () => {
      await instanceUnderTest.getDataHolder('testId')
      expect(vi.mocked(GetDataHolderUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case with id', async () => {
      await instanceUnderTest.getDataHolder('testId')
      verify(mockGetDataHolderUseCase.execute(anything())).once()
      const [idArg] = capture(mockGetDataHolderUseCase.execute).first()
      expect(idArg).toBe('testId')
    })
    it('returns data holder with latest scan summary attached by default', async () => {
      await expect(
        instanceUnderTest.getDataHolder('testId'),
      ).resolves.toStrictEqual({
        ...APIDataFactory.dataHolder,
        latestScanSummary: APIDataFactory.dataHolderScanSummary,
      })
    })
    it('fetches the latest scan summary with limit 1', async () => {
      await instanceUnderTest.getDataHolder('testId')
      verify(mockListDataHolderScanSummariesUseCase.execute(anything())).once()
      const [args] = capture(
        mockListDataHolderScanSummariesUseCase.execute,
      ).first()
      expect(args).toStrictEqual({ dataHolderId: 'testId', limit: 1 })
    })
    it('omits latestScanSummary when there are no scan summaries', async () => {
      when(
        mockListDataHolderScanSummariesUseCase.execute(anything()),
      ).thenResolve({ scanSummaries: [], nextToken: undefined })
      await expect(
        instanceUnderTest.getDataHolder('testId'),
      ).resolves.toStrictEqual(APIDataFactory.dataHolder)
    })
    it('does not fetch scan summaries when includeScanSummary is false', async () => {
      const result = await instanceUnderTest.getDataHolder('testId', {
        includeScanSummary: false,
      })
      expect(result).toStrictEqual(APIDataFactory.dataHolder)
      verify(mockListDataHolderScanSummariesUseCase.execute(anything())).never()
    })
    it('returns data holder without summary when scan summary fetch fails', async () => {
      when(
        mockListDataHolderScanSummariesUseCase.execute(anything()),
      ).thenReject(new Error('scan summary error'))
      await expect(
        instanceUnderTest.getDataHolder('testId'),
      ).resolves.toStrictEqual(APIDataFactory.dataHolder)
    })
    it('returns undefined when not found', async () => {
      when(mockGetDataHolderUseCase.execute(anything())).thenResolve(undefined)
      await expect(
        instanceUnderTest.getDataHolder('nonExistentId'),
      ).resolves.toBeUndefined()
    })
    it('throws when use case throws', async () => {
      when(mockGetDataHolderUseCase.execute(anything())).thenReject(
        new Error('get error'),
      )
      await expect(instanceUnderTest.getDataHolder('testId')).rejects.toThrow(
        'get error',
      )
    })
  })

  describe('listDataHolders', () => {
    beforeEach(() => {
      when(mockListDataHoldersUseCase.execute(anything())).thenResolve({
        dataHolders: [EntityDataFactory.dataHolder],
        nextToken: 'nextToken',
      })
    })
    it('generates use case', async () => {
      await instanceUnderTest.listDataHolders(anything())
      expect(vi.mocked(ListDataHoldersUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case as expected', async () => {
      const virtualPresenceId = 'testVirtualPresenceId'
      const limit = 100
      const nextToken = v4()
      await instanceUnderTest.listDataHolders({
        virtualPresenceId,
        limit,
        nextToken,
      })
      verify(mockListDataHoldersUseCase.execute(anything())).once()
      const [args] = capture(mockListDataHoldersUseCase.execute).first()
      expect(args).toStrictEqual({
        virtualPresenceId,
        limit,
        nextToken,
      })
    })
    it('returns empty list if use case result is empty list', async () => {
      when(mockListDataHoldersUseCase.execute(anything())).thenResolve({
        dataHolders: [],
        nextToken: undefined,
      })
      await expect(
        instanceUnderTest.listDataHolders(anything()),
      ).resolves.toStrictEqual({
        items: [],
        nextToken: undefined,
      })
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.listDataHolders(anything()),
      ).resolves.toStrictEqual({
        items: [APIDataFactory.dataHolder],
        nextToken: 'nextToken',
      })
    })
    it('throws when use case throws', async () => {
      when(mockListDataHoldersUseCase.execute(anything())).thenReject(
        new Error('use case error'),
      )
      await expect(
        instanceUnderTest.listDataHolders(anything()),
      ).rejects.toThrow('use case error')
    })
  })

  describe('listDataHolderScanSummaries', () => {
    beforeEach(() => {
      when(
        mockListDataHolderScanSummariesUseCase.execute(anything()),
      ).thenResolve({
        scanSummaries: [EntityDataFactory.dataHolderScanSummary],
        nextToken: 'nextToken',
      })
    })
    it('generates use case', async () => {
      await instanceUnderTest.listDataHolderScanSummaries(anything())
      expect(
        vi.mocked(ListDataHolderScanSummariesUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case as expected', async () => {
      const dataHolderId = 'testId'
      const limit = 100
      const nextToken = v4()
      await instanceUnderTest.listDataHolderScanSummaries({
        dataHolderId,
        limit,
        nextToken,
      })
      verify(mockListDataHolderScanSummariesUseCase.execute(anything())).once()
      const [args] = capture(
        mockListDataHolderScanSummariesUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        dataHolderId,
        limit,
        nextToken,
      })
    })
    it('returns empty list if use case result is empty list', async () => {
      when(
        mockListDataHolderScanSummariesUseCase.execute(anything()),
      ).thenResolve({
        scanSummaries: [],
        nextToken: undefined,
      })
      await expect(
        instanceUnderTest.listDataHolderScanSummaries(anything()),
      ).resolves.toStrictEqual({
        items: [],
        nextToken: undefined,
      })
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.listDataHolderScanSummaries(anything()),
      ).resolves.toStrictEqual({
        items: [APIDataFactory.dataHolderScanSummary],
        nextToken: 'nextToken',
      })
    })
    it('throws when use case throws', async () => {
      when(
        mockListDataHolderScanSummariesUseCase.execute(anything()),
      ).thenReject(new Error('use case error'))
      await expect(
        instanceUnderTest.listDataHolderScanSummaries(anything()),
      ).rejects.toThrow('use case error')
    })
  })

  describe('subscribeToDataHolders', () => {
    const mockSubscriber: DataHolderSubscriber = {
      dataHoldersUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }
    beforeEach(() => {
      when(mockSubscribeToDataHoldersUseCase.execute(anything())).thenResolve()
    })
    it('generates use case', async () => {
      await instanceUnderTest.subscribeToDataHolders('sub-1', mockSubscriber)
      expect(vi.mocked(SubscribeToDataHoldersUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case with subscriptionId and subscriber', async () => {
      await instanceUnderTest.subscribeToDataHolders('sub-1', mockSubscriber)
      verify(mockSubscribeToDataHoldersUseCase.execute(anything())).once()
      const [args] = capture(mockSubscribeToDataHoldersUseCase.execute).first()
      expect(args).toStrictEqual({
        subscriptionId: 'sub-1',
        subscriber: mockSubscriber,
      })
    })
    it('throws when use case throws', async () => {
      when(mockSubscribeToDataHoldersUseCase.execute(anything())).thenReject(
        new Error('subscribe error'),
      )
      await expect(
        instanceUnderTest.subscribeToDataHolders('sub-1', mockSubscriber),
      ).rejects.toThrow('subscribe error')
    })
  })

  describe('unsubscribeFromDataHolders', () => {
    it('generates use case', () => {
      instanceUnderTest.unsubscribeFromDataHolders('sub-1')
      expect(
        vi.mocked(UnsubscribeFromDataHoldersUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case with subscriptionId', () => {
      instanceUnderTest.unsubscribeFromDataHolders('sub-1')
      verify(mockUnsubscribeFromDataHoldersUseCase.execute(anything())).once()
      const [args] = capture(
        mockUnsubscribeFromDataHoldersUseCase.execute,
      ).first()
      expect(args).toBe('sub-1')
    })
  })

  // MARK: Analysis Result

  describe('getAnalysisResult', () => {
    beforeEach(() => {
      when(mockGetAnalysisResultUseCase.execute(anything())).thenResolve(
        EntityDataFactory.analysisResult,
      )
    })
    it('generates use case', async () => {
      await instanceUnderTest.getAnalysisResult('testId')
      expect(vi.mocked(GetAnalysisResultUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case with id', async () => {
      await instanceUnderTest.getAnalysisResult('testId')
      verify(mockGetAnalysisResultUseCase.execute(anything())).once()
      const [idArg] = capture(mockGetAnalysisResultUseCase.execute).first()
      expect(idArg).toBe('testId')
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.getAnalysisResult('testId'),
      ).resolves.toStrictEqual(APIDataFactory.analysisResult)
    })
    it('returns undefined when not found', async () => {
      when(mockGetAnalysisResultUseCase.execute(anything())).thenResolve(
        undefined,
      )
      await expect(
        instanceUnderTest.getAnalysisResult('nonExistentId'),
      ).resolves.toBeUndefined()
    })
    it('throws when use case throws', async () => {
      when(mockGetAnalysisResultUseCase.execute(anything())).thenReject(
        new Error('analysis error'),
      )
      await expect(
        instanceUnderTest.getAnalysisResult('testId'),
      ).rejects.toThrow('analysis error')
    })
  })

  describe('listAnalysisResults', () => {
    beforeEach(() => {
      when(mockListAnalysisResultsUseCase.execute(anything())).thenResolve({
        analysisResults: [EntityDataFactory.analysisResult],
        nextToken: 'nextToken',
      })
    })
    it('generates use case', async () => {
      await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: 'testVirtualPresenceId',
      })
      expect(vi.mocked(ListAnalysisResultsUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case as expected', async () => {
      const limit = 10
      const nextToken = v4()
      await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: 'testVirtualPresenceId',
        limit,
        nextToken,
      })
      verify(mockListAnalysisResultsUseCase.execute(anything())).once()
      const [args] = capture(mockListAnalysisResultsUseCase.execute).first()
      expect(args).toStrictEqual({
        virtualPresenceId: 'testVirtualPresenceId',
        limit,
        nextToken,
      })
    })
    it('returns empty list if use case result is empty', async () => {
      when(mockListAnalysisResultsUseCase.execute(anything())).thenResolve({
        analysisResults: [],
        nextToken: undefined,
      })
      await expect(
        instanceUnderTest.listAnalysisResults({
          virtualPresenceId: 'testVirtualPresenceId',
        }),
      ).resolves.toStrictEqual({
        items: [],
        nextToken: undefined,
      })
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.listAnalysisResults({
          virtualPresenceId: 'testVirtualPresenceId',
        }),
      ).resolves.toStrictEqual({
        items: [APIDataFactory.analysisResult],
        nextToken: 'nextToken',
      })
    })
    it('throws when use case throws', async () => {
      when(mockListAnalysisResultsUseCase.execute(anything())).thenReject(
        new Error('list error'),
      )
      await expect(
        instanceUnderTest.listAnalysisResults({
          virtualPresenceId: 'testVirtualPresenceId',
        }),
      ).rejects.toThrow('list error')
    })
  })

  describe('subscribeToAnalysisResult', () => {
    const mockSubscriber: AnalysisResultSubscriber = {
      analysisResultUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }
    beforeEach(() => {
      when(
        mockSubscribeToAnalysisResultUseCase.execute(anything()),
      ).thenResolve()
    })
    it('generates use case', async () => {
      await instanceUnderTest.subscribeToAnalysisResult('sub-1', mockSubscriber)
      expect(vi.mocked(SubscribeToAnalysisResultUseCase)).toHaveBeenCalledTimes(
        1,
      )
    })
    it('calls use case with subscriptionId and subscriber', async () => {
      await instanceUnderTest.subscribeToAnalysisResult('sub-1', mockSubscriber)
      verify(mockSubscribeToAnalysisResultUseCase.execute(anything())).once()
      const [args] = capture(
        mockSubscribeToAnalysisResultUseCase.execute,
      ).first()
      expect(args).toStrictEqual({
        subscriptionId: 'sub-1',
        subscriber: mockSubscriber,
      })
    })
    it('throws when use case throws', async () => {
      when(mockSubscribeToAnalysisResultUseCase.execute(anything())).thenReject(
        new Error('subscribe error'),
      )
      await expect(
        instanceUnderTest.subscribeToAnalysisResult('sub-1', mockSubscriber),
      ).rejects.toThrow('subscribe error')
    })
  })

  describe('unsubscribeFromAnalysisResult', () => {
    it('generates use case', () => {
      instanceUnderTest.unsubscribeFromAnalysisResult('sub-1')
      expect(
        vi.mocked(UnsubscribeFromAnalysisResultUseCase),
      ).toHaveBeenCalledTimes(1)
    })
    it('calls use case with subscriptionId', () => {
      instanceUnderTest.unsubscribeFromAnalysisResult('sub-1')
      verify(
        mockUnsubscribeFromAnalysisResultUseCase.execute(anything()),
      ).once()
      const [args] = capture(
        mockUnsubscribeFromAnalysisResultUseCase.execute,
      ).first()
      expect(args).toBe('sub-1')
    })
  })

  describe('getOrganizationAnalysis', () => {
    beforeEach(() => {
      when(mockGetOrganizationAnalysisUseCase.execute(anything())).thenResolve(
        EntityDataFactory.organizationAnalysis,
      )
    })
    it('generates use case', async () => {
      await instanceUnderTest.getOrganizationAnalysis({ domain: 'example.com' })
      expect(vi.mocked(GetOrganizationAnalysisUseCase)).toHaveBeenCalledTimes(1)
    })
    it('calls use case with domain and transformed mode', async () => {
      await instanceUnderTest.getOrganizationAnalysis({
        domain: 'example.com',
        mode: OrganizationAnalysisMode.Fetch,
      })
      verify(mockGetOrganizationAnalysisUseCase.execute(anything())).once()
      const [args] = capture(mockGetOrganizationAnalysisUseCase.execute).first()
      expect(args).toStrictEqual({
        domain: 'example.com',
        mode: OrganizationAnalysisModeEntity.Fetch,
      })
    })
    it('passes undefined mode when omitted', async () => {
      await instanceUnderTest.getOrganizationAnalysis({ domain: 'example.com' })
      const [args] = capture(mockGetOrganizationAnalysisUseCase.execute).first()
      expect(args).toStrictEqual({ domain: 'example.com', mode: undefined })
    })
    it('returns expected result', async () => {
      await expect(
        instanceUnderTest.getOrganizationAnalysis({ domain: 'example.com' }),
      ).resolves.toStrictEqual(APIDataFactory.organizationAnalysis)
    })
    it('returns undefined when not found', async () => {
      when(mockGetOrganizationAnalysisUseCase.execute(anything())).thenResolve(
        undefined,
      )
      await expect(
        instanceUnderTest.getOrganizationAnalysis({ domain: 'example.com' }),
      ).resolves.toBeUndefined()
    })
    it('throws when use case throws', async () => {
      when(mockGetOrganizationAnalysisUseCase.execute(anything())).thenReject(
        new Error('get error'),
      )
      await expect(
        instanceUnderTest.getOrganizationAnalysis({ domain: 'example.com' }),
      ).rejects.toThrow('get error')
    })
  })
})
