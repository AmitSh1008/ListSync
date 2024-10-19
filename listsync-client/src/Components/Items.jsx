import React, { useState, useEffect } from "react";
import {
  getListItems,
  createItem,
  patchItem,
  deleteItem,
  addPartner,
  getListPartners,
} from "../api";
import {
  Button,
  Form,
  Input,
  List,
  Modal,
  Typography,
  Card,
  Checkbox,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { lightenColor } from "../Utils";
import "../Styles/Items.css";

const { Title, Paragraph } = Typography;

// Placeholder partners list
const placeholderPartners = [
  { id: 1, email: "partner1@example.com" },
  { id: 2, email: "partner2@example.com" },
  { id: 3, email: "partner3@example.com" },
];

const Items = ({ token, listId, listName, listDescription, listColor }) => {
  const [items, setItems] = useState([]);
  const [partners, setPartners] = useState(placeholderPartners);
  const [itemName, setItemName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPartnerModalVisible, setIsPartnerModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getListItems(listId, token);
        setItems(response);
      } catch (error) {
        alert("Error fetching items");
      }
    };

    const fetchPartners = async () => {
      try {
        const partnersData = await getListPartners(listId, token);
        setPartners(partnersData);
      } catch (error) {
        alert("Error fetching partners");
      }
    };

    if (token) {
      fetchItems();
      fetchPartners();
    }
  }, [token, listId]);

  const handleCreateItem = async () => {
    try {
      const newItem = await createItem(
        { list_id: listId, name: itemName },
        token
      );
      setItems([...items, newItem]);
      setItemName("");
    } catch (error) {
      alert("Error creating item");
    }
  };

  const handlePatchItem = async (itemId, field, value) => {
    try {
      const updatedData = { [field]: value };
      const updatedItem = await patchItem(itemId, updatedData, token);
      setItems(items.map((item) => (item.id === itemId ? updatedItem : item)));
    } catch (error) {
      alert("Error updating item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId, token);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      alert("Error deleting item");
    }
  };

  const toggleItemStatus = async (item) => {
    try {
      await handlePatchItem(item.id, "status", !item.status);
    } catch (error) {
      alert("Error toggling item status");
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleEditConfirm = () => {
    if (editingItem) {
      handlePatchItem(editingItem.id, "name", editingItem.name);
    }
    setIsModalVisible(false);
    setEditingItem(null);
  };

  const handleAddPartner = async () => {
    try {
      await addPartner(listId, partnerEmail, token);
      const updatedPartners = await getListPartners(listId, token); // Refresh partners list after adding
      setPartners(updatedPartners);
      setPartnerEmail(""); // Clear the input field
      setIsPartnerModalVisible(false); // Close the modal
      message.success("Partner added successfully");
    } catch (error) {
      message.error("Error adding partner");
    }
  };

  // Lighten the header card color
  const headerCardColor = lightenColor(listColor, 0.2);
  const headerShadowColor = lightenColor(listColor, -0.2); // Darken for shadow

  // 3D effect styles
  const headerStyle = {
    backgroundColor: headerCardColor,
    boxShadow: `0 4px 8px ${headerShadowColor}, 0 6px 20px rgba(0, 0, 0, 0.4)`,
    transform: "translateY(-5px)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div className="items-container" style={{ backgroundColor: listColor }}>
      <Card className="items-header-card" style={headerStyle}>
        <Title
          level={2}
          style={{
            color: "black",
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.5)",
          }}
        >
          {listName}
        </Title>
        <Paragraph style={{ color: "black" }}>{listDescription}</Paragraph>
        <div className="partners-section">
          <Title level={4} style={{ color: "black" }}>
            שותפים:
          </Title>
          {partners.map((partner, index) => (
            <Tag key={index} color="blue">
              {partner.partner_email}
            </Tag>
          ))}
          <Button
            type="dashed"
            icon={<UserAddOutlined />}
            onClick={() => setIsPartnerModalVisible(true)}
            style={{ marginLeft: "10px" }}
          >
            הוסף שותף
          </Button>
        </div>
      </Card>
      <Card className="items-content-card">
      <Form layout="inline" onFinish={handleCreateItem} className="items-form">
  <Form.Item className="items-form-input">
    <Input
      type="text"
      placeholder="הכנס פריט חדש"
      value={itemName}
      onChange={(e) => setItemName(e.target.value)}
      required
    />
  </Form.Item>
  <Form.Item className="button-container">
    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
      הוסף
    </Button>
  </Form.Item>
</Form>
        <List
          className="items-list"
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditItem(item)}
                >
                  ערוך
                </Button>,
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteItem(item.id)}
                >
                  מחק
                </Button>,
              ]}
            >
              <Checkbox
                checked={item.status}
                onChange={() => toggleItemStatus(item)}
              >
                <span className={item.status ? "completed" : ""}>
                  {item.name}
                </span>
              </Checkbox>
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
      <Modal
        title="הוסף שותף"
        visible={isPartnerModalVisible}
        onOk={handleAddPartner}
        onCancel={() => setIsPartnerModalVisible(false)}
      >
        <Input
          type="email"
          placeholder="הכנס כתובת אימייל"
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Items;

// const handleAddPartner = async () => {
//   try {
//     await addPartner(listId, partnerEmail, token);
//     const updatedPartners = await getListPartners(listId, token);
//     setPartners(updatedPartners);
//     setPartnerEmail('');
//     setIsPartnerModalVisible(false);
//   } catch (error) {
//     alert('Error adding partner');
//   }
// };
