import React, { useState, useEffect } from 'react';
import Items from './Items';
import { getListDetails } from '../api'; // פונקציה שמביאה פרטי רשימה

const ListContainer = ({ token, listId }) => {
  const [listDetails, setListDetails] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        // אחזור שם ותיאור הרשימה מהשרת
        const response = await getListDetails(listId, token);
        console.log(response);
        setListDetails(response); // שמירת שם ותיאור הרשימה בסטייט
      } catch (error) {
        console.error('Error fetching list details:', error);
      }
    };

    if (token && listId) {
      fetchListDetails(); // קריאה לפונקציה שמביאה את שם ותיאור הרשימה
    }
  }, [token, listId]);

  return (
    <Items
      token={token}
      listId={listId}
      listName={listDetails.name}
      listDescription={listDetails.description}
    />
  );
};

export default ListContainer;
