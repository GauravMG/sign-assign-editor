import React from 'react';
import { Form } from 'antd';
import NodeProperties from './NodeProperties';

const NodePropertiesWrapper = (props) => {
	const [form] = Form.useForm();

	return <NodeProperties {...props} form={form} />;
};

export default NodePropertiesWrapper;
