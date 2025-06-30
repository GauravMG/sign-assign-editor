import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../../components/common/Scrollbar';

const { Panel } = Collapse;

class MapProperties extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		form: PropTypes.any,
		onChange: PropTypes.func,
		selectedItem: PropTypes.any,
	};

	onValuesChange = (changedValues, allValues) => {
		const { onChange, selectedItem } = this.props;
		if (onChange) {
			onChange(selectedItem, changedValues, { workarea: allValues });
		}
	};

	render() {
		const { canvasRef, form } = this.props;
		const showArrow = false;

		if (!canvasRef) return null;

		return (
			<Scrollbar>
				<Form
					layout="horizontal"
					onValuesChange={this.onValuesChange}
					form={form}
				>
					<Collapse bordered={false}>
						{Object.keys(PropertyDefinition.map).map(key => (
							<Panel
								key={key}
								header={PropertyDefinition.map[key].title}
								showArrow={showArrow}
							>
								{PropertyDefinition.map[key].component.render(
									canvasRef,
									form,
									canvasRef.handler.workarea,
								)}
							</Panel>
						))}
					</Collapse>
				</Form>
			</Scrollbar>
		);
	}
}

export default MapProperties;
