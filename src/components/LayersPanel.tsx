import React, { useEffect, useState } from "react";
import { List, Button, Tooltip, Input, message } from "antd";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import { fabric } from "fabric";

interface LayersPanelProps {
    canvas: fabric.Canvas | null;
}

interface LayerItem {
    object: fabric.Object;
    id: string;
    name: string;
    type: string;
    visible: boolean;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ canvas }) => {
    const [layers, setLayers] = useState<LayerItem[]>([]);
    const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
    const [nameEdits, setNameEdits] = useState<{ [id: string]: string }>({});

    const updateLayers = () => {
        if (canvas) {
            const objs = canvas.getObjects().slice().reverse();
            const data = objs.map((obj: any, i) => ({
                object: obj,
                id: obj.__uid || `layer-${i}`,
                name: obj.name || obj.id || obj.type || `Layer ${i + 1}`,
                type: obj.type || "unknown",
                visible: obj.visible !== false,
            }));
            setLayers(data);
        }
    };

    useEffect(() => {
        if (!canvas) return;

        updateLayers();

        canvas.on("object:added", updateLayers);
        canvas.on("object:removed", updateLayers);
        canvas.on("object:modified", updateLayers);
        canvas.on("object:selection:updated", updateLayers);
        canvas.on("object:selection:cleared", updateLayers);

        return () => {
            canvas.off("object:added", updateLayers);
            canvas.off("object:removed", updateLayers);
            canvas.off("object:modified", updateLayers);
            canvas.off("object:selection:updated", updateLayers);
            canvas.off("object:selection:cleared", updateLayers);
        };
    }, [canvas]);

    const selectLayer = (obj: fabric.Object) => {
        canvas?.setActiveObject(obj);
        canvas?.renderAll();
    };

    const bringForward = (obj: fabric.Object) => {
        canvas?.bringForward(obj);
        canvas?.renderAll();
        updateLayers();
    };

    const sendBackward = (obj: fabric.Object) => {
        canvas?.sendBackwards(obj);
        canvas?.renderAll();
        updateLayers();
    };

    const deleteLayer = (obj: fabric.Object) => {
        canvas?.remove(obj);
        canvas?.discardActiveObject();
        canvas?.renderAll();
        updateLayers();
        message.success("Layer deleted");
    };

    const toggleVisibility = (layer: LayerItem) => {
        layer.object.set("visible", !layer.visible);
        canvas?.renderAll();
        updateLayers();
    };

    const saveLayerName = (layerId: string, obj: fabric.Object) => {
        const newName = nameEdits[layerId];
        if (newName && newName.trim() !== "") {
            obj.set("name", newName.trim());
            canvas?.renderAll();
            message.success("Layer renamed");
        }
        setEditingLayerId(null);
        updateLayers();
    };

    return (
        <div style={{ width: "100%" }}>
            <List
                size="small"
                bordered
                dataSource={layers}
                renderItem={(layer) => {
                    const isActive =
                        canvas?.getActiveObject() === layer.object;

                    const itemStyle: React.CSSProperties = {
                        backgroundColor: isActive
                            ? "#e6f7ff"
                            : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 8px",
                        opacity: layer.visible ? 1 : 0.5,
                    };

                    return (
                        <List.Item
                            key={layer.id}
                            style={itemStyle}
                            onClick={() => selectLayer(layer.object)}
                        >
                            <div style={{ flex: 1 }}>
                                {editingLayerId === layer.id ? (
                                    <Input
                                        size="small"
                                        autoFocus
                                        value={nameEdits[layer.id] ?? layer.name}
                                        onChange={(e) =>
                                            setNameEdits({
                                                ...nameEdits,
                                                [layer.id]: e.target.value,
                                            })
                                        }
                                        onPressEnter={() =>
                                            saveLayerName(
                                                layer.id,
                                                layer.object
                                            )
                                        }
                                        onBlur={() =>
                                            saveLayerName(
                                                layer.id,
                                                layer.object
                                            )
                                        }
                                    />
                                ) : (
                                    <span>{layer.object?.id ?? layer.name}</span>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: 4 }}>
                                <Tooltip
                                    title={
                                        layer.visible
                                            ? "Hide layer"
                                            : "Show layer"
                                    }
                                >
                                    <Button
                                        size="small"
                                        icon={
                                            layer.visible ? (
                                                <EyeOutlined />
                                            ) : (
                                                <EyeInvisibleOutlined />
                                            )
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleVisibility(layer);
                                        }}
                                    />
                                </Tooltip>
                                {editingLayerId === layer.id ? (
                                    <Tooltip title="Save name">
                                        <Button
                                            size="small"
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                saveLayerName(
                                                    layer.id,
                                                    layer.object
                                                );
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Rename layer">
                                        <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingLayerId(layer.id);
                                                setNameEdits((prev) => ({
                                                    ...prev,
                                                    [layer.id]: layer.name,
                                                }));
                                            }}
                                        />
                                    </Tooltip>
                                )}
                                <Tooltip title="Bring forward">
                                    <Button
                                        size="small"
                                        icon={<ArrowUpOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            bringForward(layer.object);
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="Send backward">
                                    <Button
                                        size="small"
                                        icon={<ArrowDownOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            sendBackward(layer.object);
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="Delete layer">
                                    <Button
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteLayer(layer.object);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default LayersPanel;
