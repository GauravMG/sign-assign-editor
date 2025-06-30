import React, { Component } from 'react';
import i18n from 'i18next';
import { List, Divider, Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import ReactJson from 'react-json-view';
import WorkflowSiderContainer from './WorkflowSiderContainer';
import { CommonButton, InputJson } from '../../components/common';
import { Flex } from '../../components/flex';

interface IProps {
	workflow?: any;
	onChange?: any;
}

interface IState {
	types: string[];
	vars: Record<string, any>;
	selectedVar: any;
	visible: boolean;
	isEdit: boolean;
	errors: any;
}

const initSelectedVar = {
	type: 'text',
	key: null,
	value: null,
};

class WorkflowGlobalParameters extends Component<IProps, IState> {
	formRef = React.createRef<any>();

	constructor(props: IProps) {
		super(props);

		this.state = {
			types: ['text', 'number', 'boolean', 'json'],
			vars: props.workflow?.vars || {},
			selectedVar: initSelectedVar,
			visible: false,
			isEdit: false,
			errors: null,
		};
	}

	getComponentByType = (type: string) => {
		switch (type) {
			case 'text':
				return <Input />;
			case 'number':
				return <InputNumber style={{ width: '100%' }} />;
			case 'boolean':
				return <Switch />;
			case 'json':
				return <InputJson onValidate={this.handlers.onValidate} />;
			default:
				return <Input />;
		}
	};

	getType = (variable: any) => {
		if (typeof variable.value === 'number') {
			return 'number';
		} else if (typeof variable.value === 'boolean') {
			return 'boolean';
		} else {
			if (
				typeof variable.value === 'string' &&
				variable.value.startsWith('{') &&
				variable.value.endsWith('}')
			) {
				return 'json';
			} else {
				return 'text';
			}
		}
	};

	handlers = {
		onModalVisible: (visible: boolean) => {
			if (visible) {
				this.setState(
					{
						visible,
					},
					() => {
						this.formRef.current?.resetFields();
					}
				);
				return;
			}
			this.setState(
				{
					visible,
					selectedVar: initSelectedVar,
				},
				() => {
					this.formRef.current?.resetFields();
				}
			);
		},

		onAdd: () => {
			this.setState(
				{
					isEdit: false,
					selectedVar: initSelectedVar,
				},
				() => {
					this.handlers.onModalVisible(true);
				}
			);
		},

		onClear: () => {
			this.props.onChange?.(null, { workflow: { vars: {} } }, null);
			this.setState({
				vars: {},
				selectedVar: initSelectedVar,
			});
		},

		onDelete: (key: string) => {
			const vars = { ...this.state.vars };
			delete vars[key];
			this.props.onChange?.(null, { workflow: { vars } }, null);
			this.setState({
				vars,
			});
		},

		onEdit: (variable: any) => {
			variable.type = this.getType(variable);
			this.setState(
				{
					isEdit: true,
					selectedVar: variable,
				},
				() => {
					this.handlers.onModalVisible(true);
				}
			);
		},

		onOk: async () => {
			try {
				const values = await this.formRef.current?.validateFields();
				let vars = { ...this.state.vars };
				if (this.state.isEdit) {
					delete vars[this.state.selectedVar.key];
				}
				vars = {
					...vars,
					[values.key]: values.value,
				};
				this.setState(
					{
						vars,
					},
					() => {
						this.props.onChange?.(null, { workflow: { vars } }, null);
						this.handlers.onModalVisible(false);
					}
				);
			} catch (errorInfo) {
				// validation failed
			}
		},

		onCancel: () => {
			this.handlers.onModalVisible(false);
		},

		onChange: (value: string) => {
			let newValue = null;
			if (value === 'number') {
				newValue = 0;
			} else if (value === 'boolean') {
				newValue = false;
			}
			const selectedVar = {
				...this.state.selectedVar,
				type: value,
				value: newValue,
			};
			this.setState({
				selectedVar,
			});
		},

		onValidate: (errors: any) => {
			this.setState({
				errors,
			});
		},

		keyValidator: (_: any, value: string) => {
			if (!this.state.isEdit) {
				if (this.state.vars[value]) {
					return Promise.reject(
						i18n.t('common.enter-exist', { arg: value }) as string
					);
				}
			}
			return Promise.resolve();
		},

		valueValidator: (_: any, value: any) => {
			if (this.state.errors) {
				return Promise.reject(this.state.errors);
			}
			return Promise.resolve();
		},
	};

	render() {
		const { vars, selectedVar, visible, isEdit, types } = this.state;

		const dataSource = Object.keys(vars).map((key) => ({
			key,
			value: vars[key],
		}));

		const rules = [{ required: true, message: i18n.t('common.enter-property') }];
		if (selectedVar.type === 'json') {
			rules.push({
				validator: this.handlers.valueValidator,
			});
		}

		return (
			<WorkflowSiderContainer
				title={i18n.t('workflow.variables')}
				icon="globe"
			>
				<Flex justifyContent="flex-end">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						icon="plus"
						onClick={this.handlers.onAdd}
					/>
					<CommonButton
						className="rde-action-btn"
						type="danger"
						shape="circle"
						icon="times"
						onClick={this.handlers.onClear}
					/>
				</Flex>

				<Divider style={{ margin: '12px 0' }} />

				<List
					dataSource={dataSource}
					renderItem={(variable) => {
						const actions = [
							<CommonButton
								key="edit"
								className="rde-action-btn"
								shape="circle"
								icon="edit"
								onClick={() => this.handlers.onEdit(variable)}
							/>,
							<CommonButton
								key="delete"
								className="rde-action-btn"
								shape="circle"
								icon="trash"
								onClick={() => this.handlers.onDelete(variable.key)}
							/>,
						];

						const description =
							this.getType(variable) === 'json' ? (
								<ReactJson
									src={JSON.parse(variable.value)}
									name={false}
									enableClipboard={false}
									displayDataTypes={false}
									groupArraysAfterLength={10}
									collapseStringsAfterLength={100}
								/>
							) : (
								<pre>{variable.value?.toString()}</pre>
							);

						return (
							<List.Item actions={actions}>
								<List.Item.Meta
									title={variable.key}
									description={description}
								/>
							</List.Item>
						);
					}}
				/>

				<Modal
					title={
						isEdit
							? i18n.t('workflow.variables-modify')
							: i18n.t('workflow.variables-add')
					}
					onOk={this.handlers.onOk}
					onCancel={this.handlers.onCancel}
					visible={visible}
				>
					<Form
						ref={this.formRef}
						layout="vertical"
						initialValues={{
							key: selectedVar.key,
							type: selectedVar.type,
							value: selectedVar.value,
						}}
					>
						<Form.Item
							label={i18n.t('common.key')}
							name="key"
							colon={false}
							rules={[
								{ required: true, message: i18n.t('common.enter-property') },
								{ validator: this.handlers.keyValidator },
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label={i18n.t('common.type')}
							name="type"
							colon={false}
						>
							<Select
								value={selectedVar.type}
								onChange={this.handlers.onChange}
								style={{ width: '100%' }}
							>
								{types.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							label={i18n.t('common.value')}
							name="value"
							colon={false}
							rules={rules}
							valuePropName={
								selectedVar.type === 'boolean'
									? 'checked'
									: 'value'
							}
						>
							{this.getComponentByType(selectedVar.type)}
						</Form.Item>
					</Form>
				</Modal>
			</WorkflowSiderContainer>
		);
	}
}

export default WorkflowGlobalParameters;
