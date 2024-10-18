// src/Components/Lists.js
import React, { useState, useEffect } from 'react';
import { getUserLists, createList } from '../api';
import Items from './Items';

const Lists = ({ token, userId }) => {
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);

  // Fetch user lists when component mounts
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await getUserLists(userId, token);
        setLists(response);
      } catch (error) {
        alert('Error fetching lists');
      }
    };

    if (token) {
      fetchLists();
    }
  }, [token, userId]);

  // Handle creating a new list
  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const newList = await createList({ user_id: userId, name: listName, description: listDescription }, token);
      setLists([...lists, newList]); // Add the new list to the state
      setListName(''); // Clear the name input
      setListDescription(''); // Clear the description input
    } catch (error) {
      alert('Error creating list');
    }
  };

  return (
    <div>
      <h2>Your Lists</h2>
      {selectedListId ? (
        <Items token={token} listId={selectedListId} />
      ) : (
        <>
          <form onSubmit={handleCreateList}>
            <input
              type="text"
              placeholder="New List Name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="List Description"
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
            />
            <button type="submit">Create List</button>
          </form>
          <ul>
            {lists.map((list) => (
              <li key={list.id}>
                <h3>{list.name}</h3>
                <p>{list.description}</p>
                <button onClick={() => setSelectedListId(list.id)}>View Items</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Lists;
