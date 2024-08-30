import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartitems] = useState({});
  const url = "https://tomatofood-backend.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Function to retrieve and set the token
  const getToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      return storedToken;
    }
    return null;
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartitems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartitems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    const currentToken = getToken();
    if (currentToken) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 0) {
      setCartitems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }

    const currentToken = getToken();
    if (currentToken) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartitems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const token = getToken();
      if (token) {
        await loadCartData(token);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  const contextValue = {
    food_list,
    cartItems,
    setCartitems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
