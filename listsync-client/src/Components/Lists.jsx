import React, { useState, useEffect } from "react";
import { getUserLists, createList, getPartneredLists } from "../api";
import ListContainer from "./ListContainer";
import { Form, Input, Button, Typography, Layout } from "antd";
import { PlusOutlined, UnorderedListOutlined, SearchOutlined } from "@ant-design/icons";
import "../Styles/Lists.css";

const { Title, Paragraph } = Typography;
const { Content, Sider } = Layout;

// מערך של צבעים לשימוש עבור הרשימות
const listColors = [
  '#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', 
  '#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3'
];

const Lists = ({ token, userId, userEmail }) => {
  const [lists, setLists] = useState([]);
  const [partneredLists, setPartneredLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedListColor, setSelectedListColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await getUserLists(userId, token);
        setLists(response);
        setFilteredLists(response);
      } catch (error) {
        alert("שגיאה בטעינת הרשימות");
      }
    };

    const fetchPartneredLists = async () => {
      try {
        const response = await getPartneredLists(userEmail, token);
        setPartneredLists(response);
      } catch (error) {
        alert("שגיאה בטעינת רשימות משותפות");
      }
    };

    if (token) {
      fetchLists();
      fetchPartneredLists();
    }
  }, [token, userId, userEmail]);

  useEffect(() => {
    const filtered = lists.filter(list => 
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLists(filtered);
  }, [searchTerm, lists]);

  const handleCreateList = async (values) => {
    try {
      const newList = await createList(
        { user_id: userId, name: values.name, description: values.description },
        token
      );
      setLists([...lists, newList]);
      setFilteredLists([...filteredLists, newList]);
      form.resetFields();
    } catch (error) {
      alert("שגיאה ביצירת רשימה חדשה");
    }
  };

  const handleSelectList = (listId, color) => {
    setSelectedListId(listId);
    setSelectedListColor(color);
  };

  return (
    <Layout className="lists-layout">
      <Sider width={300} className="lists-sider">
        <div className="lists-sider-content">
          <Title level={3} className="lists-sider-title">
            הרשימות שלך
          </Title>
          <Input
            placeholder="חפש רשימות"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lists-search"
          />
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
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                צור רשימה חדשה
              </Button>
            </Form.Item>
          </Form>
          <div className="lists-menu">
            {filteredLists.map((list, index) => {
              const color = listColors[index % listColors.length];
              return (
                <div
                  key={list.id}
                  className={`list-menu-item ${selectedListId === list.id ? 'active' : ''}`}
                  onClick={() => handleSelectList(list.id, color)}
                  style={{ backgroundColor: color }}
                >
                  <Button
                    icon={<UnorderedListOutlined />}
                    block
                    className="list-menu-item-button"
                  >
                    {list.name}
                  </Button>
                  <Paragraph className="list-menu-item-description">
                    {list.description}
                  </Paragraph>
                </div>
              );
            })}
          </div>
          {partneredLists.length > 0 && (
            <>
              <Title level={4} className="lists-sider-title">
                רשימות משותפות
              </Title>
              <div className="lists-menu">
                {partneredLists.map((list, index) => {
                  const color = listColors[index % listColors.length];
                  return (
                    <div
                      key={list.id}
                      className={`list-menu-item ${selectedListId === list.id ? 'active' : ''}`}
                      onClick={() => handleSelectList(list.id, color)}
                      style={{ backgroundColor: color }}
                    >
                      <Button
                        icon={<UnorderedListOutlined />}
                        block
                        className="list-menu-item-button"
                      >
                        {list.name}
                      </Button>
                      <Paragraph className="list-menu-item-description">
                        {list.description}
                      </Paragraph>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Sider>
      <Content className="lists-content">
        {selectedListId ? (
          <ListContainer 
            token={token} 
            listId={selectedListId} 
            listColor={selectedListColor}
            onBack={() => setSelectedListId(null)} 
          />
        ) : (
          <div className="lists-welcome">
            <Title level={2}>ברוכים הבאים לניהול הרשימות שלך</Title>
            <p>בחר רשימה מהתפריט או צור רשימה חדשה כדי להתחיל</p>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Lists;