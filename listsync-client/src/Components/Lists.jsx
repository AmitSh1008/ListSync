import React, { useState, useEffect } from "react";
import { getUserLists, createList } from "../api";
import ListContainer from "./ListContainer";
import { Row, Col, Card, Form, Input, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../Styles/Lists.css";

const { Title, Paragraph } = Typography;

// Array of background colors for cards
const cardColors = [
  '#FFD6E0', '#FFEFCF', '#DCEDC2', '#A2D2FF', '#C1BBDD', 
  '#FFC8A2', '#D4F0F0', '#FCE1E4', '#DAEAF6', '#F0E6EF'
];

const Lists = ({ token, userId }) => {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await getUserLists(userId, token);
        setLists(response);
      } catch (error) {
        alert("Error fetching lists");
      }
    };

    if (token) {
      fetchLists();
    }
  }, [token, userId]);

  const handleCreateList = async (values) => {
    try {
      const newList = await createList(
        { user_id: userId, name: values.name, description: values.description },
        token
      );
      setLists([...lists, newList]);
      form.resetFields();
    } catch (error) {
      alert("Error creating list");
    }
  };

  return (
    <div className="lists-page-container">
      <div className="lists-page-content">
        <Title level={2} className="lists-page-title">
          הרשימות שלך:
        </Title>
        {selectedListId ? (
          <ListContainer token={token} listId={selectedListId} />
        ) : (
          <>
            <Form
              form={form}
              name="create_list"
              onFinish={handleCreateList}
              layout="vertical"
              className="lists-create-form"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "יש צורך בהכנסת שם!" }]}
              >
                <Input placeholder="שם הרשימה" />
              </Form.Item>
              <Form.Item name="description">
                <Input.TextArea placeholder="תיאור הרשימה" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  צור רשימה
                </Button>
              </Form.Item>
            </Form>
            <Row gutter={[16, 16]} className="lists-grid">
              {lists.map((list, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={list.id}>
                  <Card
                    hoverable
                    className="lists-card"
                    style={{ backgroundColor: cardColors[index % cardColors.length] }}
                    title={list.name}
                    extra={
                      <Button type="primary" onClick={() => setSelectedListId(list.id)}>
                        הצג פריטים
                      </Button>
                    }
                  >
                    <Paragraph ellipsis={{ rows: 3 }} className="lists-card-description">
                      {list.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default Lists;