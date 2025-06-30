import React, { Component } from 'react';
import { Divider, Form, Input, Switch, Button } from 'antd';
import i18n from 'i18next';
import WorkflowSiderContainer from './WorkflowSiderContainer';
import { CommonButton } from '../../components/common';

interface IProps {
	workflow?: any;
	onChange?: (selected: any, changedValues: any, allValues: any) => void;
}

interface IState {
	isEdit: boolean;
}

class WorkflowInfo extends Component<IProps, IState> {
	formRef = React.createRef<any>();

	constructor(props: IProps) {
		super(props);

		this.state = {
			isEdit: false,
		};
	}

	handlers = {
		onClick: async () => {
			const { isEdit } = this.state;
			if (isEdit) {
				try {
					const values = await this.formRef.current?.validateFields();
					this.props.onChange?.(null, { workflow: values }, null);
					this.setState({ isEdit: false });
				} catch (e) {
					// validation errors
				}
			} else {
				this.setState({ isEdit: true });
			}
		},
	};

	render() {
		const { workflow } = this.props;
		const { isEdit } = this.state;

		const extra = (
			<CommonButton
				className="rde-action-btn"
				shape="circle"
				icon={isEdit ? 'save' : 'edit'}
				onClick={this.handlers.onClick}
				tooltipTitle={isEdit ? i18n.t('action.save') : i18n.t('action.modify')}
			/>
		);

		const editComponent = (
			<Form
				layout="vertical"
				ref={this.formRef}
				initialValues={{
					name: workflow?.name,
					description: workflow?.description,
					enabled: workflow?.enabled,
				}}
			>
				<Form.Item
					label={i18n.t('common.name')}
					name="name"
					rules={[
						{
							required: true,
							message: i18n.t('validation.enter-property', {
								arg: i18n.t('common.name'),
							}),
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={i18n.t('common.description')}
					name="description"
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item
					label={i18n.t('common.enabled')}
					name="enabled"
					valuePropName="checked"
				>
					<Switch />
				</Form.Item>
			</Form>
		);

		const viewComponent = (
			<>
				<h2
					style={{
						color: workflow?.enabled
							? '#49a9ee'
							: 'rgba(0, 0, 0, 0.65)',
					}}
				>
					{workflow?.name}
				</h2>
				<Divider style={{ margin: '12px 0' }} />
				<div>{workflow?.description}</div>
			</>
		);

		return (
			<WorkflowSiderContainer
				title={i18n.t('workflow.workflow-info')}
				icon="cog"
				extra={extra}
			>
				{isEdit ? editComponent : viewComponent}
			</WorkflowSiderContainer>
		);
	}
}

export default WorkflowInfo;
