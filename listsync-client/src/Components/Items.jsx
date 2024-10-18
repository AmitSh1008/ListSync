import React, { useState, useEffect } from 'react';
import { getListItems, createItem, patchItem, deleteItem } from '../api';
import { Button, Form, Input, List, Modal, Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const Items = ({ token, listId, listName, listDescription }) => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch list items when component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getListItems(listId, token);
        setItems(response);
      } catch (error) {
        alert('Error fetching items');
      }
    };

    if (token) {
      fetchItems();
    }
  }, [token, listId]);

  // Handle creating a new item
  const handleCreateItem = async () => {
    try {
      const newItem = await createItem({ list_id: listId, name: itemName }, token);
      setItems([...items, newItem]);
      setItemName('');
    } catch (error) {
      alert('Error creating item');
    }
  };

  // Handle updating an item partially
  const handlePatchItem = async (itemId, field, value) => {
    try {
      const updatedData = { [field]: value };
      const updatedItem = await patchItem(itemId, updatedData, token);
      setItems(items.map((item) => (item.id === itemId ? updatedItem : item)));
    } catch (error) {
      alert('Error updating item');
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId, token);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      alert('Error deleting item');
    }
  };

  // Toggle item status (mark as done or not)
  const toggleItemStatus = async (item) => {
    try {
      await handlePatchItem(item.id, 'status', !item.status);
    } catch (error) {
      alert('Error toggling item status');
    }
  };

  // Handle editing item name
  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleEditConfirm = () => {
    if (editingItem) {
      handlePatchItem(editingItem.id, 'name', editingItem.name);
    }
    setIsModalVisible(false);
    setEditingItem(null);
  };

  return (
    <div className="container mt-4">
      <Card className="mb-4" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
  <Title level={2}>{listName}</Title>
  <Paragraph>{listDescription}</Paragraph>
</Card>
      <Card className="mb-4" style={{ padding: '20px' }}>
        <Form layout="inline" onFinish={handleCreateItem} className="mb-4">
          <Form.Item>
            <Input
              type="text"
              placeholder="הכנס פריט"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              הוסף פריט
            </Button>
          </Form.Item>
        </Form>
        <List
          bordered
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button onClick={() => handleEditItem(item)}>ערוך</Button>,
                <Button danger onClick={() => handleDeleteItem(item.id)}>
                  מחק
                </Button>,
              ]}
            >
              <span
                style={{ textDecoration: item.status ? 'line-through' : 'none', cursor: 'pointer' }}
                onClick={() => toggleItemStatus(item)}
              >
                {item.name}
              </span>
            </List.Item>
          )}
        />
      </Card>
      <Modal
        title="ערוך פריט"
        visible={isModalVisible}
        onOk={handleEditConfirm}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={editingItem?.name}
          onChange={(e) =>
            setEditingItem((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </Modal>
    </div>
  );
};

export default Items;
