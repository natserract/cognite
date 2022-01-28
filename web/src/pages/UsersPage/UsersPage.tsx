import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import {
  useEditableTable,
  Row,
  Card,
  Col,
  Form,
  List,
  Table,
  getDefaultSortOrder,
  EditButton,
  Space,
  ShowButton,
  DeleteButton,
  Button,
} from '@pankod/refine';

import { TableFilter } from 'src/components/table'
import { useState } from 'react';

const searchConfig = {
  searchAmount: 'amount',
  donationType: 'donation_for_type',
}

const getUserName = (values: Array<any>, key: string) => {
  return values && values.length && values.find(p => p['Name'] === key);
}

const UsersPage = () => {
  const {
    tableProps,
    formProps,
    sorter,
    searchFormProps,
    isEditing,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    setEditId,
    queryResult,
    tableQueryResult,
  } = useEditableTable({
    resource: 'listUserCognito',
    metaData: {
      isCustom: true,
      fields: [
        'Users',
      ],
      offsetField: 'Users',
    },
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Row gutter={[16, 16]}>
      <Col lg={6} xs={24}>
        <Card title="Filters">
          <TableFilter formProps={searchFormProps} />
        </Card>
      </Col>
      <Col lg={18} xs={24}>
        <List>
          <Form {...formProps}>
            <Table
              {...tableProps}
              rowKey="Username"
              rowSelection={rowSelection}
              pagination={{
                ...tableProps.pagination,
                current: 1,
                pageSize: 5,
                pageSizeOptions: [],
                showLessItems: true,
                responsive: true,
              }}
              onChange={() => console.log('stateSource change')}
              onRow={(record: any) => ({
                onClick: (event: any) => {
                  if (event.target.nodeName === "TD") {
                    console.log('Edit', event, record)
                    setEditId && setEditId(record.Username);
                  }
                },
              })}
            >
              <Table.Column
                dataIndex="Attributes"
                title="Username"
                sorter
                render={(value: any, record: any) => {
                  const item = getUserName(value, 'email');

                  return (
                    <>
                      {item['Value'] || 'Empty'}
                    </>
                  )
                }}
              />

              <Table.Column
                dataIndex="UserStatus"
                title="Status"
              />

              <Table.Column
                dataIndex="actions"
                title="Actions"
                render={(value: any, record: any) => {
                  const item = getUserName(record['Attributes'], 'email');

                  return (
                    <Space>
                      <EditButton
                        hideText
                        size="small"
                        recordItemId={record.Username}
                      />
                      <ShowButton
                        hideText
                        size="small"
                        recordItemId={record.Username}
                      />
                      <DeleteButton
                        hideText
                        resourceName="userCognito"
                        metaData={{
                          isCustom: true,
                          variables: {
                            username: {
                              value: item['Value'],
                              type: "String",
                              required: true
                            }
                          }
                        }}
                        size="small"
                        recordItemId={record.Username}
                      />
                    </Space>
                  )
                }}
              />
            </Table>
          </Form>
        </List>
      </Col>
    </Row >
  )
}

export default UsersPage
