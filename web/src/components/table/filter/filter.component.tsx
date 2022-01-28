import { Button, Form, FormProps, Icons, Input, Select } from "@pankod/refine";
import React from "react";

const searchConfig = {
  searchAmount: 'amount',
  donationType: 'donation_for_type',
}

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
  const { ...formProps } = props;

  return (
    <Form layout="vertical" {...formProps}>
      <Form.Item label="Search" name={searchConfig.searchAmount}>
        <Input
          placeholder="Search amount"
          prefix={<Icons.SearchOutlined />}
        />
      </Form.Item>
      <Form.Item label="Donation types" name={searchConfig.donationType}>
        <Select
          options={[
            {
              label: "Programs",
              value: "programs",
            },
            {
              label: "Events",
              value: "events",
            },
          ]}
          allowClear
          placeholder="Search Donation Type"
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Filter
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Filter;
