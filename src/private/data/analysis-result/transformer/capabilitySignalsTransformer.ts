/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CapabilitySignals as CapabilitySignalsGraphQL } from '../../../../gen/graphqlTypes'
import { CapabilitySignals } from '../../../../public/typings/analysisResult'
import { CapabilitySignalsEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'
import { SignalValueTransformer } from './signalValueTransformer'

export class CapabilitySignalsTransformer {
  private readonly signalValueTransformer = new SignalValueTransformer()

  fromGraphQLToEntity(data: CapabilitySignalsGraphQL): CapabilitySignalsEntity {
    return {
      supportsAccountCreation: this.signalValueTransformer.fromGraphQLToEntity(
        data.supportsAccountCreation,
      ),
      supportsAccountDeletion: this.signalValueTransformer.fromGraphQLToEntity(
        data.supportsAccountDeletion,
      ),
      supportsDataDeletionRequests:
        this.signalValueTransformer.fromGraphQLToEntity(
          data.supportsDataDeletionRequests,
        ),
      supportsDataExport: this.signalValueTransformer.fromGraphQLToEntity(
        data.supportsDataExport,
      ),
      supportsSubscriptions: this.signalValueTransformer.fromGraphQLToEntity(
        data.supportsSubscriptions,
      ),
      supportsOptOutOfSale: this.signalValueTransformer.fromGraphQLToEntity(
        data.supportsOptOutOfSale,
      ),
      usesCookiesOrTracking: this.signalValueTransformer.fromGraphQLToEntity(
        data.usesCookiesOrTracking,
      ),
      supportsTwoFactorAuth: this.signalValueTransformer.fromGraphQLToEntity(
        data.supportsTwoFactorAuth,
      ),
    }
  }

  fromEntityToAPI(entity: CapabilitySignalsEntity): CapabilitySignals {
    return {
      supportsAccountCreation: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsAccountCreation,
      ),
      supportsAccountDeletion: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsAccountDeletion,
      ),
      supportsDataDeletionRequests: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsDataDeletionRequests,
      ),
      supportsDataExport: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsDataExport,
      ),
      supportsSubscriptions: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsSubscriptions,
      ),
      supportsOptOutOfSale: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsOptOutOfSale,
      ),
      // Deprecated: surfaced for backward compatibility, populated from
      // `supportsOptOutOfSale`.
      sellsPersonalInformation: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsOptOutOfSale,
      ),
      usesCookiesOrTracking: this.signalValueTransformer.fromEntityToAPI(
        entity.usesCookiesOrTracking,
      ),
      supportsTwoFactorAuth: this.signalValueTransformer.fromEntityToAPI(
        entity.supportsTwoFactorAuth,
      ),
    }
  }
}
