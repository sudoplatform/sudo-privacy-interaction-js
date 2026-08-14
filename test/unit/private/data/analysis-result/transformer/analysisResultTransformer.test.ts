/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultTransformer } from '../../../../../../src/private/data/analysis-result/transformer/analysisResultTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('AnalysisResultTransformer Test Suite', () => {
  const instanceUnderTest = new AnalysisResultTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL analysis result to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.analysisResult,
        ),
      ).toStrictEqual(EntityDataFactory.analysisResult)
    })

    it('transforms GraphQL analysis result without data to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.analysisResultPending,
        ),
      ).toStrictEqual(EntityDataFactory.analysisResultPending)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity to API analysis result correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.analysisResult),
      ).toStrictEqual(APIDataFactory.analysisResult)
    })

    ;(it('transforms entity to API analysis result without data correctly'),
      () => {
        expect(
          instanceUnderTest.fromEntityToAPI(
            EntityDataFactory.analysisResultPending,
          ),
        ).toStrictEqual(APIDataFactory.analysisResultPending)
      })
  })
})
