import React, { Component } from 'react';
import { Form, Divider, Input } from 'antd';
import i18n from 'i18next';
import NodeDescriptor from './configuration/NodeDescriptor';
import NodeAction from './configuration/NodeAction';
import NodeConfiguration from './configuration/NodeConfiguration';
import { Canvas } from '../../canvas';
import { Scrollbar } from '../../components/common';
import { Flex } from '../../components/flex';

interface IProps {
	canvasRef?: Canvas;
	selectedItem?: any;
	workflow?: any;
	onChange?: (selectedItem: any, changedValues: any, allValues: any) => void;
	descriptors?: any;
}

interface IState {}

class WorkflowNodeConfigurations extends Component<IProps, IState> {
	formRef = React.createRef<any>();

	componentDidUpdate(prevProps: IProps) {
		// equivalent of UNSAFE_componentWillReceiveProps
		const { selectedItem } = this.props;
		if (selectedItem && prevProps.selectedItem) {
			if (prevProps.selectedItem.id !== selectedItem.id) {
				this.formRef.current?.resetFields();
			}
		}
	}

	onValuesChange = (changedValues: any, allValues: any) => {
		const { onChange, selectedItem } = this.props;
		onChange?.(selectedItem, changedValues, allValues);
	};

	render() {
		const { canvasRef, workflow, selectedItem } = this.props;

		return (
			<Scrollbar>
				<Form
					layout="horizontal"
					ref={this.formRef}
					initialValues={{
						name: selectedItem?.name,
						description: selectedItem?.description,
					}}
					onValuesChange={this.onValuesChange}
				>
					{selectedItem ? (
						<>
							<NodeDescriptor workflow={workflow} selectedItem={selectedItem} />
							<Flex flexDirection="column" style={{ margin: '8px 16px' }}>
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
									colon={false}
								>
									<Input
										minLength={0}
										maxLength={30}
										placeholder={i18n.t('workflow.node-name-required')}
									/>
								</Form.Item>
								<Form.Item
									label={i18n.t('common.description')}
									name="description"
									colon={false}
								>
									<Input.TextArea
										style={{ maxHeight: 200 }}
										placeholder={i18n.t('workflow.node-description-required')}
									/>
								</Form.Item>
							</Flex>
							<Divider>{i18n.t('workflow.node-configuration')}</Divider>
							<Flex
								flexDirection="column"
								style={{ height: '100%', overflowY: 'hidden', margin: '8px 16px' }}
							>
								<NodeConfiguration
									canvasRef={canvasRef}
									selectedItem={selectedItem}
									workflow={workflow}
									form={this.formRef.current}
								/>
							</Flex>
							<NodeAction
								workflow={workflow}
								selectedItem={selectedItem}
								canvasRef={canvasRef}
							/>
						</>
					) : null}
				</Form>
			</Scrollbar>
		);
	}
}

export default WorkflowNodeConfigurations;
