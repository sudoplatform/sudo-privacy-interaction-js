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
      sellsPersonalInformation: this.signalValueTransformer.fromGraphQLToEntity(
        data.sellsPersonalInformation,
      ),
      usesCookiesOrTracking: this.signalValueTransformer.fromGraphQLToEntity(
        data.usesCookiesOrTracking,
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
      sellsPersonalInformation: this.signalValueTransformer.fromEntityToAPI(
        entity.sellsPersonalInformation,
      ),
      usesCookiesOrTracking: this.signalValueTransformer.fromEntityToAPI(
        entity.usesCookiesOrTracking,
      ),
    }
  }
}
