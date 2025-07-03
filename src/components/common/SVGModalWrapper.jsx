import React from 'react';
import { Form } from 'antd';
import SVGModal from './SVGModal';

const SVGModalWrapper = (props) => {
	const [form] = Form.useForm();

	return (
		<SVGModal
			{...props}
			form={form}
		/>
	);
};

export default SVGModalWrapper;
