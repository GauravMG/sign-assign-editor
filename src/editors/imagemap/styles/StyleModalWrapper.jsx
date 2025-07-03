import React from 'react';
import { Form } from 'antd';
import StyleModal from './StyleModal';

const StyleModalWrapper = (props) => {
	const [form] = Form.useForm();

	return <StyleModal {...props} form={form} />;
};

export default StyleModalWrapper;
