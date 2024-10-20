import axios from 'axios';

const API_URL = 'http://shilmanamit1008.ddns.net:5000/api';

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Get user lists
export const getUserLists = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/lists/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Create a new list
export const createList = async (listData, token) => {
  try {
    const response = await axios.post(`${API_URL}/lists`, listData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

export const getListDetails = async (listId, token) => {
  try {
    const response = await axios.get(`${API_URL}/lists/${listId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Delete a list
export const deleteList = async (listId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/lists/${listId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Get items of a list
export const getListItems = async (listId, token) => {
  try {
    const response = await axios.get(`${API_URL}/items/list/${listId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Partially update an item in a list
export const patchItem = async (itemId, itemData, token) => {
  try {
    const response = await axios.patch(`${API_URL}/items/${itemId}`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Create a new item in a list
export const createItem = async (itemData, token) => {
  try {
    const response = await axios.post(`${API_URL}/items`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Delete an item from a list
export const deleteItem = async (itemId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Add a partner to a list by email
export const addPartner = async (listId, partnerEmail, token) => {
  try {
    const response = await axios.post(`${API_URL}/partners`, 
      { list_id: listId, partner_email: partnerEmail }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Get all partners of a list
export const getListPartners = async (listId, token) => {
  try {
    const response = await axios.get(`${API_URL}/partners/${listId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};

// Get lists where the user is a partner
export const getPartneredLists = async (userEmail, token) => {
  try {
    const response = await axios.get(`${API_URL}/partners/lists/${userEmail}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Server error');
  }
};