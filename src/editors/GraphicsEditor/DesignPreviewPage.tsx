import React, { useEffect, useState } from 'react';
import { Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const DesignPreviewPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the saved design from localStorage
    const savedImage = localStorage.getItem('graphicsEditorDesign');
    if (savedImage) {
      setImageUrl(savedImage);
    } else {
      message.warning('No design found. Redirecting to editor.');
      navigate('/');
    }
  }, [navigate]);

  const handleEditDesign = () => {
    navigate('/');
  };

  const handleAddToCart = () => {
    message.success('Design added to cart!');
    // implement your logic to proceed further
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        padding: 24,
        boxSizing: 'border-box',
        background: '#f0f2f5',
      }}
    >
      {/* Left Section */}
      <div
        style={{
          flex: 1,
          marginRight: 24,
          background: '#fff',
          borderRadius: 4,
          padding: 24,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Title level={3}>Design Preview</Title>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Design Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              marginBottom: 24,
              border: '1px solid #eee',
              borderRadius: 4,
            }}
          />
        ) : (
          <Paragraph>No preview available.</Paragraph>
        )}
        <Button type="primary" onClick={handleEditDesign}>
          Edit Design
        </Button>
      </div>

      {/* Right Section */}
      <div
        style={{
          width: 300,
          background: '#fff',
          borderRadius: 4,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title level={4}>Instructions</Title>
          <Paragraph>
            Please review your design. Click "Add to Cart" to proceed to purchase,
            or "Edit Design" to make changes.
          </Paragraph>
        </div>
        <Button type="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default DesignPreviewPage;
