import React, { useState } from "react";
import { Button, Divider, InputNumber, Select, message } from "antd";

const { Option } = Select;

const predefinedSizes = [
    { label: "4 x 6 inches", width: 4, height: 6, unit: "inches" },
    { label: "8 x 10 inches", width: 8, height: 10, unit: "inches" },
    { label: "12 x 18 inches", width: 12, height: 18, unit: "inches" },
    { label: "2 x 3 ft", width: 2, height: 3, unit: "ft" },
    { label: "3 x 5 ft", width: 3, height: 5, unit: "ft" },
];

interface CanvasSizePanelProps {
    onApplySize: (width: number, height: number) => void;
    maxWidth: number;
    maxHeight: number;
}

const CanvasSizePanel: React.FC<CanvasSizePanelProps> = ({ onApplySize, maxWidth,
    maxHeight, }) => {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [customWidth, setCustomWidth] = useState<number | null>(null);
    const [customHeight, setCustomHeight] = useState<number | null>(null);
    const [unit, setUnit] = useState<"inches" | "ft">("inches");

    const handlePresetChange = (value: string) => {
        setSelectedPreset(value);
        const preset = predefinedSizes.find((p) => p.label === value);
        if (preset) {
            setCustomWidth(preset.width);
            setCustomHeight(preset.height);
            setUnit(preset.unit as "inches" | "ft");
        }
    };

    const handleApply = () => {
        if (!customWidth || !customHeight) {
            message.error("Please enter both width and height.");
            return;
        }

        // Convert to pixels (assuming 96 DPI for inches, 12 inches per ft)
        const multiplier = unit === "inches" ? 96 : 12 * 96;
        let widthPx = customWidth * multiplier;
        let heightPx = customHeight * multiplier;

        // Ensure canvas fits into max bounds
        const scaleX = maxWidth / widthPx;
        const scaleY = maxHeight / heightPx;
        const scale = Math.min(scaleX, scaleY, 1);

        widthPx *= scale;
        heightPx *= scale;

        onApplySize(Math.round(widthPx), Math.round(heightPx));
        message.success(`Canvas resized to ${Math.round(widthPx)} × ${Math.round(heightPx)} px`);
    };

    return (
        <div>
            <h3>Predefined Sizes</h3>
            <Select
                style={{ width: "100%", marginBottom: 16 }}
                placeholder="Select size"
                onChange={handlePresetChange}
                value={selectedPreset || undefined}
            >
                {predefinedSizes.map((p) => (
                    <Option key={p.label} value={p.label}>
                        {p.label}
                    </Option>
                ))}
            </Select>

            <Divider>OR</Divider>

            <h3>Custom Size</h3>

            <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
                <InputNumber
                    placeholder="Width"
                    min={1}
                    value={customWidth || undefined}
                    onChange={setCustomWidth}
                />
                <span>x</span>
                <InputNumber
                    placeholder="Height"
                    min={1}
                    value={customHeight || undefined}
                    onChange={setCustomHeight}
                />
                <Select
                    value={unit}
                    onChange={(val) => setUnit(val as "inches" | "ft")}
                    style={{ width: 90 }}
                >
                    <Option value="inches">Inches</Option>
                    <Option value="ft">Feet</Option>
                </Select>
            </div>

            <Button
                type="primary"
                block
                style={{ backgroundColor: "#452e73", borderColor: "#452e73" }}
                onClick={handleApply}
            >
                Apply Size
            </Button>
        </div>
    );
};

export default CanvasSizePanel;
