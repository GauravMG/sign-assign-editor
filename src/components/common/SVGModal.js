import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Radio } from 'antd';
import i18n from 'i18next';

import { InputHtml } from '.';
import FileUpload from './FileUpload';

class SVGModal extends Component {
	static propTypes = {
		onOk: PropTypes.func.isRequired,
		onCancel: PropTypes.func,
		visible: PropTypes.bool.isRequired,
		form: PropTypes.object, // passed from wrapper
	};

	state = {
		loadType: 'file',
		visible: false,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.visible !== this.props.visible) {
			this.setState({
				visible: this.props.visible,
			});
		}
	}

	handleChangeSvgType = (e) => {
		const { form } = this.props;
		form.resetFields();
		this.setState({
			loadType: e.target.value,
		});
	};

	handleOk = () => {
		const { form, onOk } = this.props;
		form.validateFields().then((values) => {
			if (values.svg instanceof Blob) {
				const reader = new FileReader();
				reader.readAsDataURL(values.svg);
				reader.onload = () => {
					onOk({ ...values, svg: reader.result });
				};
			} else {
				onOk(values);
			}
		}).catch(() => {});
	};

	handleCancel = () => {
		const { onCancel } = this.props;
		if (onCancel) {
			onCancel();
		} else {
			this.setState({
				visible: false,
			});
		}
	};

	render() {
		const { form } = this.props;
		const { loadType, visible } = this.state;

		return (
			<Modal
				title={i18n.t('imagemap.svg.add-svg')}
				closable
				onCancel={this.handleCancel}
				onOk={this.handleOk}
				open={visible}
			>
				<Form
					form={form}
					layout="vertical"
					colon={false}
				>
					<Form.Item
						label={i18n.t('common.type')}
						name="loadType"
						initialValue={loadType}
					>
						<Radio.Group onChange={this.handleChangeSvgType}>
							<Radio.Button value="file">{i18n.t('common.file')}</Radio.Button>
							<Radio.Button value="svg">{i18n.t('common.svg')}</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						label={loadType === 'svg' ? i18n.t('common.svg') : i18n.t('common.file')}
						name="svg"
						rules={[
							{
								required: true,
								message: i18n.t('validation.enter-property', {
									arg:
										loadType === 'svg'
											? i18n.t('common.svg')
											: i18n.t('common.file'),
								}),
							},
						]}
					>
						{loadType === 'svg'
							? <InputHtml />
							: <FileUpload accept=".svg" />
						}
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default SVGModal;
