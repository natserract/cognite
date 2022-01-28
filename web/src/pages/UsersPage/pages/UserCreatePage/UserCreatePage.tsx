import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import {
  Create,
  Form,
  Input,
  Select,
  useForm,
} from "@pankod/refine";
import { useHistory } from 'react-router-dom'

const UserCreatePage = () => {
  const history = useHistory()

  const { formProps, saveButtonProps } = useForm({
    resource: 'userCognito',
    metaData: {},
    mutationMode: "pessimistic",
    redirect: false,
    successNotification: {
      message: "Register user cognito success! Please check verification code!"
    },
    onMutationSuccess: (data) => {
      if (data) {
        history.push('/users');
      }
    }
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
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
          name="name"
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
          name="family_name"
        >
          <Input placeholder="Family Name" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
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

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tenant Id"
          name="tenant_id"
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  )
}

export default UserCreatePage
