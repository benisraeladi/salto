/*
*                      Copyright 2023 Salto Labs Ltd.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { ObjectType, isInstanceElement, InstanceElement } from '@salto-io/adapter-api'
import { makeArray } from '@salto-io/lowerdash/src/collections/array'
import mockClient from './client'
import { fetchMetadataInstances } from '../src/fetch'
import { buildMetadataQuery } from '../src/fetch_profile/metadata_query'
import { mockFileProperties, MockFilePropertiesInput } from './connection'
import { mockTypes } from './mock_elements'

describe('Test fetching installed package metadata', () => {
  const fetch = async ({
    fileProp,
    mockType,
    addNamespacePrefixToFullName,
  }:
    {
        fileProp: MockFilePropertiesInput
        mockType: ObjectType
        addNamespacePrefixToFullName: boolean
    }): Promise<InstanceElement> => {
    const { client, connection } = mockClient()
    connection.metadata.read.mockImplementation(async (_type, fullNames) => (
      makeArray(fullNames).map(fullName => ({ fullName }))
    ))

    const metadataQuery = buildMetadataQuery(
      {
        include: [{ metadataType: '.*' }],
      }
    )

    const { elements } = await fetchMetadataInstances({
      client,
      fileProps: [mockFileProperties(fileProp)],
      metadataType: mockType,
      metadataQuery,
      addNamespacePrefixToFullName,
    })
    return elements
      .filter(isInstanceElement)[0]
  }

  describe('Test fetching PermissionSets of installed packages', () => {
    describe('if the API name already includes namespacePrefix', () => {
      it('should not add prefix to PermissionSet', async () => {
        const fullNameFromList = 'Test__TestPermissionSet'
        const expectedFullName = 'Test__TestPermissionSet'
        const addNamespacePrefixToFullName = true
        const fileProp = mockFileProperties({ fullName: fullNameFromList, type: 'PermissionSet', namespacePrefix: 'Test' })
        const instance = await fetch({ fileProp, mockType: mockTypes.PermissionSet, addNamespacePrefixToFullName })

        expect(instance).toBeDefined()
        expect(instance?.value).toHaveProperty('fullName', expectedFullName)
      })
    })
    describe('if the API name does not include namespacePrefix', () => {
      it('should add prefix to the PermissionSet\'s name', async () => {
        const fullNameFromList = 'TestPermissionSet'
        const expectedFullName = 'Test__TestPermissionSet'
        const addNamespacePrefixToFullName = true
        const fileProp = mockFileProperties({ fullName: fullNameFromList, type: 'PermissionSet', namespacePrefix: 'Test' })
        const instance = await fetch({ fileProp, mockType: mockTypes.PermissionSet, addNamespacePrefixToFullName })

        expect(instance).toBeDefined()
        expect(instance?.value).toHaveProperty('fullName', expectedFullName)
      })
    })
  })
  describe('Test fetching layouts of installed packages', () => {
    // const fetch = async ({
    //   apiName,
    //   namespacePrefix,
    //   layoutNameIncludesPrefix = false,
    // }:
    //   {
    //       apiName: string
    //       namespacePrefix?: string
    //       layoutNameIncludesPrefix?: boolean
    //       customObject?: boolean

    //   }): Promise<void> => {
    //   const fileProps = [
    //     {
    //       createdById: 'aaaaaaaaa',
    //       createdByName: 'aaaaaaaaa',
    //       createdDate: '2020-08-25T11:39:01.000Z',
    //       fileName: 'layouts/Test.layout',
    //       fullName: layoutNameIncludesPrefix ? `${apiName}-SBQQ__Test Layout` : `${apiName}-Test Layout`,
    //       id: 'aaaaaaaaa',
    //       lastModifiedById: 'aaaaaaaaa',
    //       lastModifiedByName: 'aaaaaaaaa',
    //       lastModifiedDate: '2020-08-25T11:40:45.000Z',
    //       manageableState: 'installed',
    //       type: 'Layout',
    //       namespacePrefix,
    //     },
    //   ]
    //   const testLayoutType = new ObjectType({
    //     elemID: new ElemID(constants.SALESFORCE,
    //       constants.LAYOUT_TYPE_ID_METADATA_TYPE),
    //     annotations: {
    //       metadataType: constants.LAYOUT_TYPE_ID_METADATA_TYPE,
    //     },
    //   })
    //   const { client } = mockClient()
    //   client.readMetadata = jest.fn()
    //     .mockImplementation(async (_typeName: string, names: string[])
    //       : Promise<{result: {}[]; errors: string[]}> => {
    //       const result = names.map(name => {
    //         const testLayoutMetadataInfo = {
    //           [constants.INSTANCE_FULL_NAME_FIELD]: name,
    //           layoutSections: {
    //             layoutColumns: {
    //               layoutItems: [{
    //                 field: 'foo',
    //               }, {
    //                 field: 'bar',
    //               }, {
    //                 customLink: 'link',
    //               }, {
    //                 field: 'moo',
    //               }],
    //             },
    //           },
    //         }
    //         return testLayoutMetadataInfo
    //       })

    //       return { result, errors: [] }
    //     })

    //   const metadataQuery = buildMetadataQuery(
    //     {
    //       include: [{ metadataType: '.*' }],
    //     }
    //   )

    //   const { elements } = await fetchMetadataInstances({
    //     client,
    //     metadataType: testLayoutType,
    //     fileProps,
    //     metadataQuery,
    //   })
    //   const instance = elements
    //     .filter(isInstanceElement)
    //     .find(inst => inst.elemID.typeName === constants.LAYOUT_TYPE_ID_METADATA_TYPE)
    //   const targetFullName = `${apiName}-SBQQ__Test Layout`
    //   expect(instance).toBeDefined()
    //   expect(instance?.elemID).toEqual(LAYOUT_TYPE_ID.createNestedID('instance', naclCase(targetFullName)))
    // }
    describe('if the API name already includes namespacePrefix', () => {
      describe('if layout name does not include prefix', () => {
        it('should add prefix to layout name', async () => {
          const apiName = 'SBQQ__TestApiName__c'
          const fullNameFromList = `${apiName}-Test Layout`
          const expectedFullName = `${apiName}-SBQQ__Test Layout`
          const addNamespacePrefixToFullName = true
          const fileProp = mockFileProperties({ fullName: fullNameFromList, type: 'Layout', namespacePrefix: 'SBQQ' })
          const instance = await fetch({ fileProp, mockType: mockTypes.Layout, addNamespacePrefixToFullName })

          expect(instance).toBeDefined()
          expect(instance?.value).toHaveProperty('fullName', expectedFullName)
        })
      })
      describe('if layout name already includes prefix', () => {
        it('should not add prefix to layout name', async () => {
          const apiName = 'SBQQ__TestApiName__c'
          const fullNameFromList = `${apiName}-SBQQ__Test Layout`
          const expectedFullName = `${apiName}-SBQQ__Test Layout`
          const addNamespacePrefixToFullName = true
          const fileProp = mockFileProperties({ fullName: fullNameFromList, type: 'Layout', namespacePrefix: 'SBQQ' })
          const instance = await fetch({ fileProp, mockType: mockTypes.Layout, addNamespacePrefixToFullName })

          expect(instance).toBeDefined()
          expect(instance?.value).toHaveProperty('fullName', expectedFullName)
        })
      })
    })
    describe('if the API name does not include namespacePrefix', () => {
      describe('if layout  name does not include prefix', () => {
        it('should add prefix to the layout\'s name', async () => {
          const apiName = 'TestApiName__c'
          const fullNameFromList = `${apiName}-Test Layout`
          const expectedFullName = `${apiName}-SBQQ__Test Layout`
          const addNamespacePrefixToFullName = true
          const fileProp = mockFileProperties({ fullName: fullNameFromList, type: 'Layout', namespacePrefix: 'SBQQ' })
          const instance = await fetch({ fileProp, mockType: mockTypes.Layout, addNamespacePrefixToFullName })

          expect(instance).toBeDefined()
          expect(instance?.value).toHaveProperty('fullName', expectedFullName)
        })
      })
      describe('if layout name already includes namespacePrefix', () => {
        it('should not add prefix to the layout\'s name', async () => {
          const apiName = 'TestApiName__c'
          const fullNameFromList = `${apiName}-SBQQ__Test Layout`
          const expectedFullName = `${apiName}-SBQQ__Test Layout`
          const addNamespacePrefixToFullName = true
          const fileProp = mockFileProperties({ fullName: fullNameFromList, type: 'Layout', namespacePrefix: 'SBQQ' })
          const instance = await fetch({ fileProp, mockType: mockTypes.Layout, addNamespacePrefixToFullName })

          expect(instance).toBeDefined()
          expect(instance?.value).toHaveProperty('fullName', expectedFullName)
        })
      })
    })
  })
})