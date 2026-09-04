/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CategorySignals as CategorySignalsGraphQL } from '../../../../gen/graphqlTypes'
import { CategorySignals } from '../../../../public/typings/analysisResult'
import { CategorySignalsEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'
import { DataCategoryTransformer } from './dataCategoryTransformer'
import { RetentionInfoTransformer } from './retentionInfoTransformer'
import { ShareStyleTransformer } from './shareStyleTransformer'
import { SignalValueTransformer } from './signalValueTransformer'

export class CategorySignalsTransformer {
  private readonly dataCategoryTransformer = new DataCategoryTransformer()
  private readonly signalValueTransformer = new SignalValueTransformer()
  private readonly shareStyleTransformer = new ShareStyleTransformer()
  private readonly retentionInfoTransformer = new RetentionInfoTransformer()

  fromGraphQLToEntity(data: CategorySignalsGraphQL): CategorySignalsEntity {
    return {
      category: this.dataCategoryTransformer.fromGraphQLToEntity(data.category),
      collected: this.signalValueTransformer.fromGraphQLToEntity(
        data.collected,
      ),
      dataLabels: data.dataLabels,
      sharedWithThirdParties: this.shareStyleTransformer.fromGraphQLToEntity(
        data.sharedWithThirdParties,
      ),
      monetized: this.signalValueTransformer.fromGraphQLToEntity(
        data.monetized,
      ),
      retained: this.signalValueTransformer.fromGraphQLToEntity(data.retained),
      retention: data.retention
        ? this.retentionInfoTransformer.fromGraphQLToEntity(data.retention)
        : undefined,
      userCanOptOut: this.signalValueTransformer.fromGraphQLToEntity(
        data.userCanOptOut,
      ),
      requiredForService: this.signalValueTransformer.fromGraphQLToEntity(
        data.requiredForService ?? 'NO',
      ),
      requiredForLaw: this.signalValueTransformer.fromGraphQLToEntity(
        data.requiredForLaw ?? 'NO',
      ),
    }
  }

  fromEntityToAPI(entity: CategorySignalsEntity): CategorySignals {
    return {
      category: this.dataCategoryTransformer.fromEntityToAPI(entity.category),
      collected: this.signalValueTransformer.fromEntityToAPI(entity.collected),
      dataLabels: entity.dataLabels,
      sharedWithThirdParties: this.shareStyleTransformer.fromEntityToAPI(
        entity.sharedWithThirdParties,
      ),
      monetized: this.signalValueTransformer.fromEntityToAPI(entity.monetized),
      retained: this.signalValueTransformer.fromEntityToAPI(entity.retained),
      retention: entity.retention
        ? this.retentionInfoTransformer.fromEntityToAPI(entity.retention)
        : undefined,
      userCanOptOut: this.signalValueTransformer.fromEntityToAPI(
        entity.userCanOptOut,
      ),
      requiredForService: this.signalValueTransformer.fromEntityToAPI(
        entity.requiredForService,
      ),
      requiredForLaw: this.signalValueTransformer.fromEntityToAPI(
        entity.requiredForLaw,
      ),
    }
  }
}
