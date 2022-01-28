import { GraphQLClient } from "graphql-request";
import * as gql from "gql-query-builder";
import pluralize from "pluralize";
import camelCase from "camelcase";
import { GetListArgs, GetManyArgs } from "./types";
import { toCamelCase } from "src/utils/string";
import { iterToObject, generateFilter } from "src/utils/array";

const dataProvider = (client: GraphQLClient) => {
  return {
    getList: async ({
      resource,
      pagination,
      sort,
      filters,
      metaData,
      requestHeaders
    }: GetListArgs) => {
      console.log('getList called')
      console.log('getList metaData', metaData);

      const current = pagination?.current || 1; // as page = 1
      const pageSize = pagination?.pageSize || 10; // as ITEMS_PER_PAGE as limit

      const sortBy = iterToObject(sort, 'field', 'order');
      let $where = generateFilter(iterToObject(filters, 'field')!!);

      console.log('sortBy', sortBy)

      // Guard for clear filter, or if filter has lack values
      // Set data to default, $where => not executed
      if ($where) {
        for (const [key, value] of Object.entries($where)) {
          const objField = Object.values(value)

          if (
            objField.includes(0)
            || objField.includes(NaN)
            || objField.includes("")
            || objField.includes(undefined)
          ) {
            // Delete [prop] lack values in current object
            delete $where[key]
          }
        }
      }

      console.log('$where', $where)

      const camelResource = camelCase(resource);
      const operation = metaData?.operation ?? camelResource;

      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;

      console.log('variables', metaData?.variables)

      const queryVariables = {
        input: {
          value: {
            ...metaData?.variables,
            ...sortBy && {
              sort: JSON.stringify(sortBy)
            },
            ...$where && {
              filter: JSON.stringify($where),
            },
            start: (current - 1) * pageSize || 1,
            limit: pageSize,
          },
          type: `${camelName}`,
        }
      }

      const { query, variables } = gql.query({
        operation,
        ...(!metaData?.isCustom) && {
          variables: { ...queryVariables }
        },
        fields: [...metaData?.fields!!],
      })
      console.log('query getList', query, variables)

      const response = await client.request(
        query,
        variables,
        requestHeaders ?? undefined
      );

      const results = {
        data: metaData?.offsetField ?
          response[operation][metaData?.offsetField] :
          response[operation],
        total: metaData?.offsetField ?
          response[operation][metaData?.offsetField].length :
          response[operation].length
      }

      console.log('results', results)

      return { ...results };

    },
    getMany: async ({ resource, metaData, requestHeaders }: GetManyArgs) => {
      console.log('getMany called')

      const camelResource = camelCase(resource);
      const operation = metaData?.operation ?? camelResource;

      const { query, variables } = gql.query({
        operation,
        variables: {
          ...metaData?.variables
        },
        fields: metaData?.fields
      });

      console.log('query getMany', query)

      const response = await client.request(
        query,
        variables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      }
    },
    getOne: async ({ resource, id, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(singularResource);

      const operation = metaData?.operation ?? camelResource;
      const { query, variables } = gql.query({
        operation,
        variables: {
          ...(!metaData.isCustom) && {
            id: {
              value: +id!!,
              type: "Int",
              required: true
            }
          },
          ...metaData.variables,
        },
        fields: metaData?.fields,
      });

      console.log('query getOne', query)

      const response = await client.request(
        query,
        variables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    create: async ({ resource, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(`create-${singularResource}`);

      const operation = metaData?.operation ?? camelResource;
      const typeInput = `${toCamelCase(camelResource)}Input`;

      console.log('create resource', resource, typeInput, camelResource, variables)

      const { query: mutation, variables: gqlVariables } = gql.mutation({
        operation,
        variables: {
          input: {
            value: { ...variables },
            type: `${typeInput}`,
            required: true,
          },
        },
        fields: metaData?.fields,
      });

      console.log('query create', mutation)

      const response = await client.request(
        mutation,
        gqlVariables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    createMany: async ({ resource, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(`create-${singularResource}`);

      const operation = metaData?.operation ?? camelResource;
      const typeInput = `${toCamelCase(camelResource)}Input`;

      const onGql = (vars: Record<string, any>) => {
        const { query: mutation, variables: gqlVariables } = gql.mutation({
          operation,
          variables: {
            input: {
              value: { ...vars },
              type: `${typeInput}`,
              required: true,
            },
          },
          fields: metaData?.fields,
        });

        return {
          mutation,
          gqlVariables
        }
      }

      const response = await Promise.all(
        variables.map(async (param) => {
          const { mutation, gqlVariables } = onGql(param);
          const response = await client.request(
            mutation,
            gqlVariables ?? undefined,
            requestHeaders ?? undefined
          )

          return response
        })
      )

      console.log('response createMany', response);

      return {
        data: response
      }
    },
    update: async ({ resource, id, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(`update-${singularResource}`);

      const operation = metaData?.operation ?? camelResource;
      const typeInput = `${toCamelCase(camelResource)}Input`;

      const { query: mutation, variables: gqlVariables } = gql.mutation({
        operation,
        variables: {
          id: {
            value: +id!!,
            type: "Int",
            required: true
          },
          input: {
            value: { ...variables },
            type: `${typeInput}`,
            required: true,
          },
        },
        fields: metaData?.fields,
      });

      const response = await client.request(
        mutation,
        gqlVariables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    updateMany: async ({ resource, ids, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(`update-${singularResource}`);

      const operation = metaData?.operation ?? camelResource;
      const typeInput = `${toCamelCase(camelResource)}Input`;

      const onGql = (value: string) => {
        const { query: mutation, variables: gqlVariables } = gql.mutation({
          operation,
          variables: {
            id: {
              value: +value!!,
              type: "Int",
              required: true
            },
            input: {
              value: { ...variables },
              type: `${typeInput}`,
              required: true,
            },
          },
          fields: metaData?.fields,
        });

        return {
          mutation,
          gqlVariables
        }
      }

      const response = await Promise.all(
        ids!!.map(async (param) => {
          const { mutation, gqlVariables } = onGql(param);
          const response = await client.request(
            mutation,
            gqlVariables ?? undefined,
            requestHeaders ?? undefined
          )

          return response
        })
      )

      return {
        data: response
      }
    },
    deleteOne: async ({ resource, id, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(`delete-${singularResource}`);

      const operation = metaData?.operation ?? camelResource;
      const { query: mutation, variables } = gql.mutation({
        operation,
        variables: {
          ...(!metaData?.isCustom) && {
            id: {
              value: +id!!,
              type: "Int",
              required: true
            },
          },
          ...metaData?.variables,
        },
        fields: metaData?.fields,
      });

      console.log('mutation deleteOne', mutation);

      const response = await client.request(
        mutation,
        variables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    deleteMany: async ({ resource, ids, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(`delete-${singularResource}`);

      const operation = metaData?.operation ?? camelResource;

      const onGql = (value: string) => {
        const { query: mutation, variables: gqlVariables } = gql.mutation({
          operation,
          variables: {
            id: {
              value: +value!!,
              type: "Int",
              required: true
            },
          },
          fields: metaData?.fields,
        });

        console.log('deleteMany mutation', mutation)

        return {
          mutation,
          gqlVariables
        }
      }

      const response = await Promise.all(
        ids!!.map(async (param) => {
          const { mutation, gqlVariables } = onGql(param);
          const response = await client.request(
            mutation,
            gqlVariables ?? undefined,
            requestHeaders ?? undefined
          )

          return response
        })
      )

      return {
        data: response
      }
    },
  }
}

export default dataProvider;
