import { useShow, Show, Typography } from "@pankod/refine";
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useCognito } from 'src/libs/cognito';

const { Title, Text } = Typography;

const UserViewPage = () => {
  const { currentUser } = useCognito()

  const { queryResult } = useShow({
    resource: 'getUserCognito',
    metaData: {
      isCustom: true,
      variables: {
        username: {
          value: currentUser.email,
          type: 'String',
          required: true,
        }
      },
      fields: [
        'Username',
        'UserAttributes',
        'UserCreateDate',
      ]
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  console.log('queryResult', queryResult)


  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Key</Title>
      <Text>{record?.Username}</Text>

      <Title level={5}>Attributes</Title>
      <Text>{JSON.stringify(record?.UserAttributes)}</Text>

    </Show>
  )
}

export default UserViewPage
