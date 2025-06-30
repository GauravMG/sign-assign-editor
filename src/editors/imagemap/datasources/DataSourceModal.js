import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';

import Canvas from '../../../canvas/Canvas';
import DataSourceProperty from '../properties/DataSourceProperty';

class DataSourceModal extends Component {
	static propTypes = {
		form: PropTypes.any,
		visible: PropTypes.bool,
		animation: PropTypes.object,
		onOk: PropTypes.func,
		onCancel: PropTypes.func,
		validateTitle: PropTypes.object,
		onChange: PropTypes.func,
	};

	state = {
		width: 150,
		height: 150,
		visible: false,
	};

	containerRef = null;
	canvasRef = createRef();

	componentDidMount() {
		this.waitForContainerRender(this.containerRef);
	}

	componentDidUpdate(prevProps) {
		// reset form fields whenever modal opens
		if (this.props.visible && !prevProps.visible) {
			const { form } = this.props;
			if (form && form.resetFields) {
				form.resetFields();
			}
		}
	}

	waitForContainerRender = (container) => {
		setTimeout(() => {
			if (container) {
				this.setState({
					width: container.clientWidth,
					height: container.clientHeight,
				});
				return;
			}
			this.waitForContainerRender(this.containerRef);
		}, 5);
	};

	render() {
		const {
			form,
			visible,
			animation,
			onOk,
			onCancel,
			validateTitle,
			onChange,
		} = this.props;

		const { width, height } = this.state;

		return (
			<Modal
				open={visible}
				onOk={onOk}
				onCancel={onCancel}
			>
				<Form
					form={form}
					layout="vertical"
				>
					<Form.Item
						label="Title"
						name={['animation', 'title']}
						rules={[
							{
								required: true,
								message: validateTitle?.help || 'Title is required',
							},
						]}
						help={validateTitle?.help}
						validateStatus={validateTitle?.validateStatus}
						hasFeedback
					>
						<Input
							value={animation?.title}
							onChange={e => {
								onChange(
									null,
									{ animation: { title: e.target.value } },
									{ animation: { ...animation, title: e.target.value } },
								);
							}}
						/>
					</Form.Item>

					{DataSourceProperty.render(this.canvasRef, form, { animation })}

					<div
						ref={c => {
							this.containerRef = c;
						}}
					>
						<Canvas
							ref={this.canvasRef}
							editable={false}
							width={width}
							height={height}
						/>
					</div>
				</Form>
			</Modal>
		);
	}
}

export default DataSourceModal;
