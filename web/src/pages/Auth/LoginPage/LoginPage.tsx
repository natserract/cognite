import {
  Row,
  Col,
  AntdLayout,
  Card,
  Typography,
  Form,
  Button,
  Checkbox,
  Input,
  useNavigation
} from "@pankod/refine";
import { useCallback, useEffect } from "react";
import { useCognito } from "src/libs/cognito";

export interface ILoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm<ILoginForm>();

  const { logIn, isAuthenticated } = useCognito()
  const navigation = useNavigation()

  const onSubmit = useCallback(async (values) => {
    logIn(values.email, values.password)
      .then((response) => {
        if (response) {
          console.log('Response', response)
          navigation.replace('/');
        }
      })
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('/');
    }
  }, [isAuthenticated])

  return (
    <AntdLayout
      style={{
        backgroundColor: "#eff7f7",
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>
          <Card
            style={{
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <Form<ILoginForm>
              layout="vertical"
              form={form}
              onFinish={onSubmit}
              requiredMark={false}
              initialValues={{
                email: "alfins132@gmail.com",
                password: "Surya9090.",
              }}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input size="large" placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
                style={{ marginBottom: "12px" }}
              >
                <Input type="password" placeholder="●●●●●●●●" size="large" />
              </Form.Item>
              <div style={{ marginBottom: "12px" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Remember me
                    </Checkbox>
                </Form.Item>

                <a
                  style={{
                    float: "right",
                    fontSize: "12px",
                  }}
                  href="#"
                >
                  Forgot password?
                  </a>
              </div>
              <Button type="primary" size="large" htmlType="submit" block>
                Sign in
                </Button>
            </Form>

            <div
              style={{ textAlign: "center", padding: "10px 0px" }}
            >
              <Typography.Text>
                Still no account? Please go to <a href="#"> Sign up</a>
              </Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>
    </AntdLayout>
  );
}

export default Login;
