import React from 'react';
import { Form } from 'antd';
import MapProperties from './MapProperties';

const MapPropertiesWrapper = (props) => {
	const [form] = Form.useForm();

	return <MapProperties {...props} form={form} />;
};

export default MapPropertiesWrapper;
