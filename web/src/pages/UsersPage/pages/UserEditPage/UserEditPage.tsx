import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import {
  useForm,
  Edit,
  Form,
  Input,
  Select,
  useNavigation
} from '@pankod/refine';
import { useCognito } from 'src/libs/cognito';

const UserEditPage = () => {
  const navigation = useNavigation()
  const { currentUser } = useCognito()

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: 'userCognito',
    metaData: {
      isCustom: true,
      offsetVariable: 'UserAttributes',
      fields: [
        'Username',
        'UserAttributes',
        'UserCreateDate',
      ],
      variables: {
        token: {
          value: localStorage.getItem('token'),
          type: 'String',
          required: true,
        }
      }
    },
    mutationMode: "pessimistic",
    redirect: false,
    successNotification: {
      message: "Register user cognito success! Please check verification code!"
    },
    onMutationSuccess: (data) => {
      if (data) {
        navigation.push('/users')
      }
    }
  });

  const currentData = queryResult?.data?.data;
  console.log('currentData', currentData)

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name={['UserAttributes', "email"]}
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
        >
          <Input placeholder="Email address" />
        </Form.Item>
        <Form.Item
          label="Name"
          name={['UserAttributes', "name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          label="Family Name"
          name={['UserAttributes', "family_name"]}
        >
          <Input placeholder="Family Name" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name={['UserAttributes', "phone_number"]}
          rules={[
            {
              required: true,
              min: 11,
              max: 13,
            },
          ]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>
      </Form>
    </Edit>
  )
}

export default UserEditPage
