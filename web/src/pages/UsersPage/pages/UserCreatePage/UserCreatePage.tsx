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
    onMutationSuccess: () => {
      history.push('/users');
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
          name="familyName"
        >
          <Input placeholder="Family Name" />
        </Form.Item>
      </Form>
    </Create>
  )
}

export default UserCreatePage
