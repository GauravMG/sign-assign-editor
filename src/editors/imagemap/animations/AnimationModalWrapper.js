import React from 'react';
import { Form } from 'antd';
import AnimationModal from './AnimationModal';

const AnimationModalWrapper = (props) => {
	const [form] = Form.useForm();

	return (
		<AnimationModal
			{...props}
			form={form}
		/>
	);
};

export default AnimationModalWrapper;
