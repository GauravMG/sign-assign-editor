import React from "react";
import { Card, Col, Row } from "antd";
import { shapesCatalog } from "../config/shapesCatalog";
import { fabric } from "fabric";

interface Props {
  canvas: fabric.Canvas | null;
}

const ShapesPanel: React.FC<Props> = ({ canvas }) => {
  const addShape = (shapeCreator: () => fabric.Object) => {
    const shape = shapeCreator();
    canvas?.add(shape);
    canvas?.setActiveObject(shape);
    canvas?.requestRenderAll();
  };

  return (
    <>
      <h3>Shapes Library</h3>
      <Row gutter={[8, 8]}>
        {shapesCatalog.map((shape) => (
          <Col span={8} key={shape.name}>
            <Card
              hoverable
              size="small"
              bodyStyle={{
                backgroundColor: shape.previewColor,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => addShape(shape.create)}
            >
              <span style={{ color: "#fff", fontWeight: "bold" }}>
                {shape.name}
              </span>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ShapesPanel;
