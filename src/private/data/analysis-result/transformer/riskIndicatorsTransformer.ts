/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskIndicators as RiskIndicatorsGraphQL } from '../../../../gen/graphqlTypes'
import { RiskIndicators } from '../../../../public/typings/analysisResult'
import { RiskIndicatorsEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'
import { SignalValueTransformer } from './signalValueTransformer'

export class RiskIndicatorsTransformer {
  private readonly signalValueTransformer = new SignalValueTransformer()

  fromGraphQLToEntity(data: RiskIndicatorsGraphQL): RiskIndicatorsEntity {
    return {
      dataCollectionBreadth: data.dataCollectionBreadth,
      collectsSensitiveDataForNonEssentialPurposes:
        this.signalValueTransformer.fromGraphQLToEntity(
          data.collectsSensitiveDataForNonEssentialPurposes,
        ),
      sellsPersonalInformation: this.signalValueTransformer.fromGraphQLToEntity(
        data.sellsPersonalInformation,
      ),
      maxRetentionDays: data.maxRetentionDays ?? undefined,
      hasIndefiniteRetention: this.signalValueTransformer.fromGraphQLToEntity(
        data.hasIndefiniteRetention,
      ),
      encryptionPractices: this.signalValueTransformer.fromGraphQLToEntity(
        data.encryptionPractices,
      ),
      breachRisk: this.signalValueTransformer.fromGraphQLToEntity(
        data.breachRisk,
      ),
    }
  }

  fromEntityToAPI(entity: RiskIndicatorsEntity): RiskIndicators {
    return {
      dataCollectionBreadth: entity.dataCollectionBreadth,
      collectsSensitiveDataForNonEssentialPurposes:
        this.signalValueTransformer.fromEntityToAPI(
          entity.collectsSensitiveDataForNonEssentialPurposes,
        ),
      sellsPersonalInformation: this.signalValueTransformer.fromEntityToAPI(
        entity.sellsPersonalInformation,
      ),
      maxRetentionDays: entity.maxRetentionDays,
      hasIndefiniteRetention: this.signalValueTransformer.fromEntityToAPI(
        entity.hasIndefiniteRetention,
      ),
      encryptionPractices: this.signalValueTransformer.fromEntityToAPI(
        entity.encryptionPractices,
      ),
      breachRisk: this.signalValueTransformer.fromEntityToAPI(
        entity.breachRisk,
      ),
    }
  }
}
