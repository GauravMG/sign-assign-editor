import React from 'react';
import { Form } from 'antd';
import DataSourceModal from './DataSourceModal';

const DataSourceModalWrapper = (props) => {
	const [form] = Form.useForm();

	return (
		<DataSourceModal
			{...props}
			form={form}
		/>
	);
};

export default DataSourceModalWrapper;
