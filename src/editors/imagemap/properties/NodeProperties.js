import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, List } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../../components/common/Scrollbar';
import { Flex } from '../../../components/flex';

const { Panel } = Collapse;

class NodeProperties extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
		form: PropTypes.any,
		onChange: PropTypes.func,
	};

	componentDidUpdate(prevProps) {
		// Reset fields when selected node changes
		if (
			this.props.selectedItem &&
			prevProps.selectedItem &&
			this.props.selectedItem.id !== prevProps.selectedItem.id
		) {
			this.props.form?.resetFields();
		}
	}

	onValuesChange = (changedValues, allValues) => {
		const { onChange, selectedItem } = this.props;
		if (onChange) {
			onChange(selectedItem, changedValues, allValues);
		}
	};

	render() {
		const { canvasRef, selectedItem, form } = this.props;
		const showArrow = false;

		return (
			<Scrollbar>
				<Form
					layout="horizontal"
					colon={false}
					form={form}
					onValuesChange={this.onValuesChange}
				>
					<Collapse bordered={false}>
						{selectedItem && PropertyDefinition[selectedItem.type] ? (
							Object.keys(PropertyDefinition[selectedItem.type]).map(key => (
								<Panel
									key={key}
									header={PropertyDefinition[selectedItem.type][key].title}
									showArrow={showArrow}
								>
									{PropertyDefinition[selectedItem.type][key].component.render(
										canvasRef,
										form,
										selectedItem
									)}
								</Panel>
							))
						) : (
							<Flex
								justifyContent="center"
								alignItems="center"
								style={{
									width: '100%',
									height: '100%',
									color: 'rgba(0, 0, 0, 0.45)',
									fontSize: 16,
									padding: 16,
								}}
							>
								<List />
							</Flex>
						)}
					</Collapse>
				</Form>
			</Scrollbar>
		);
	}
}

export default NodeProperties;
