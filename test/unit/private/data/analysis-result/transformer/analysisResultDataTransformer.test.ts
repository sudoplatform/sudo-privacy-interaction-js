/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultDataTransformer } from '../../../../../../src/private/data/analysis-result/transformer/analysisResultDataTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('AnalysisResultDataTransformer Test Suite', () => {
  const instanceUnderTest = new AnalysisResultDataTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL analysis result data to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.analysisResult.data!,
        ),
      ).toStrictEqual(EntityDataFactory.analysisResult.data)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity analysis result data to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(
          EntityDataFactory.analysisResult.data!,
        ),
      ).toStrictEqual(APIDataFactory.analysisResult.data)
    })
  })
})
