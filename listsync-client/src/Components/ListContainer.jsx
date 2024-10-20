import React, { useState, useEffect } from 'react';
import Items from './Items';
import { getListDetails } from '../api';
import { Typography, Button } from 'antd';
import {
  DeleteOutlined
} from "@ant-design/icons";
import '../Styles/ListContainer.css';

const { Title } = Typography;

const ListContainer = ({ token, listId, listColor, onBack, onDeleteList, userEmail }) => {
  const [listDetails, setListDetails] = useState({ name: '', description: '' , creator_name: ''});

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await getListDetails(listId, token);
        setListDetails(response);
      } catch (error) {
        console.error('Error fetching list details:', error);
      }
    };

    if (token && listId) {
      fetchListDetails();
    }
  }, [token, listId]);

  return (
    <div className="list-container">
      <Items
        token={token}
        listId={listId}
        listName={listDetails.name}
        listDescription={listDetails.description}
        listOwner={listDetails.creator_name}
        listColor={listColor}
        userEmail={userEmail}
        onDeleteList={onDeleteList}
      />
    </div>
  );
};

export default ListContainer;