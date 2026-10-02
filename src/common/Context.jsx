import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import swal from 'sweetalert';
import swal from "sweetalert";
import Swal from "sweetalert2";

export const Context = createContext();

const AppContext = ({ children }) => {
  const initialCustomerDetail =
    JSON.parse(localStorage.getItem("customerDetail")) || {};

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ourProduct, setOurProduct] = useState([]);
  const [selectProductData, setSelectProductData] = useState(null);
  const [productSize, setProductSize] = useState("");

  const [customerDetail, setCustomerDetail] = useState(initialCustomerDetail);

  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [totalSavedAmount, setTotalSavedAmount] = useState(0);
  const [cartGrandTotal, setCartGrandTotal] = useState(0);

  const [singleItems, setSingleItems] = useState({});
  const [singleSubTotal, setSingleSubTotal] = useState(0);
  const [singleSavedAmount, setSingleSavedAmount] = useState(0);
  const [singleProductSubTotal, setSingleProductSubTotal] = useState(0);
  const [singleGrandTotal, setSingleGrandTotal] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [cardDeliveryCharge, setCardDeliveryCharge] = useState(0);
  const [singleDeliveryCharge, setSingleDeliveryCharge] = useState(0);

  useEffect(() => {
    localStorage.setItem("customerDetail", JSON.stringify(customerDetail));
  }, [customerDetail]);

  // swal({
  //   title: "Are you sure?",
  //   text: "Are you sure that you want to leave this page?",
  //   icon: "warning",
  //   dangerMode: true,
  //   buttons: {
  //     cancel: true,
  //     confirm: true,
  //   },
  // })
  // .then((result) => {
  //   if (result) {
  //     // User clicked on confirm button
  //     swal("Deleted!", "Your imaginary file has been deleted!", "success");
  //   } else {
  //     // User clicked on cancel button or closed the modal
  //     // You can add any additional actions or leave it empty to simply close the alert
  //   }
  // });

  useEffect(() => {
    let subTotal = 0;
    let totalSavedAmount = 0;
    let cartCount = 0;

    cartItems.forEach((item) => {
      if (item && item.selectedSize) {
        const itemSubTotal =
          item.selectedSize.offerPrice * item.selectedSize.quantity;
        subTotal += itemSubTotal;
        totalSavedAmount +=
          (item.selectedSize.mrp - item.selectedSize.offerPrice) *
          item.selectedSize.quantity;
      } else if (item) {
        const itemSubTotal = item.offerPrice * item.quantity;
        subTotal += itemSubTotal;
        totalSavedAmount += (item.mrp - item.offerPrice) * item.quantity;
      }

      // Count the total number of items
      cartCount += item.quantity || 0;
    });

    // Add delivery charge if subTotal is less than 500
    const deliveryCharge = subTotal < 500 ? 30 : 0;
    const grandTotal = subTotal + deliveryCharge;

    setCartGrandTotal(grandTotal);
    setCardDeliveryCharge(deliveryCharge);
    setCartSubTotal(subTotal);
    setTotalSavedAmount(totalSavedAmount);
    setCartCount(cartCount);
  }, [cartItems]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // ...

  const handleAddToCart = (product, quantity, currentItem) => {
    if (!selectProductData) {
      ourProduct.push(product._id);
      console.error("selectProductData is not defined");
    } else {
      ourProduct.push(selectProductData._id);
    }

    // Check if the product already exists in cartItems
    const index = cartItems.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      // Product already exists in cartItems, increment its quantity
      const updatedCartItems = [...cartItems];
      const existingItem = updatedCartItems[index];

      if (existingItem.selectedSize) {
        // Handle the case where selectedSize is defined
        existingItem.selectedSize.quantity += quantity;
      } else {
        // Handle the case where selectedSize is not defined
        existingItem.quantity += quantity;
      }

      setCartItems(updatedCartItems);
    } else {
      // Product does not exist in cartItems, add it
      const newItem = {
        ...product,
        quantity: quantity,
      };

      const updatedCartItems = [...cartItems, newItem];
      setCartItems(updatedCartItems);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${product?.productName} has been added to your cart`,
      showConfirmButton: false,
      timer: 1500,
    })
  };

  const handleAddToCartHome = (product, quantity) => {
    if (!selectProductData) {
      // Handle the case where selectProductData is not defined
      ourProduct.push(product?._id);
    } else {
      // Assuming ourProduct is defined somewhere in your code
      ourProduct.push(selectProductData._id);
    }

    let items = [...cartItems];
    let index = items.findIndex((p) => p.id === product._id);

    if (index !== -1) {
      if (Array.isArray(items[index].quantity)) {
        items[index].quantity += quantity;
      } else {
        items[index].quantity = [quantity];
      }
    } else {
      if (Array.isArray(product.quantity)) {
        product.quantity = quantity;
      } else {
        product.quantity = [quantity];
      }
      items = [...items, product];
    }

    localStorage.setItem("cartItems", JSON.stringify(items));

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${product?.productName} has been added to your cart`,
      showConfirmButton: false,
      timer: 1500,
    }).toUpperCase();
    setCartItems(items);
    console.log("cartItems", cartItems);
  };

  const handleRemoveFromCart = (product, index) => {
    // Remove from cartItems
    let updatedCartItems = [...cartItems];
    updatedCartItems = updatedCartItems.filter((p) => p._id !== product._id);

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);

    // Remove from ourProduct based on index
    let updatedOurProduct = [...ourProduct];
    updatedOurProduct.splice(index, 1); // Remove the product at the specified index

    // Check if updatedCartItems is empty and update updatedOurProduct accordingly
    if (updatedCartItems.length === 0) {
      updatedOurProduct = [];
    }

    setOurProduct(updatedOurProduct);
  };

  const handleBuyNow = (product) => {
    // setSingleItems(product)

    setSingleItems({
      ...singleItems,
      product: product,
    });
    navigate(`/single-product/${product?._id}`);
  };

  const handleSingleCheckout = (product) => {
    // setSingleItems(product)
    navigate(`/sp-payment-step`);
  };

  const handleCartProductQuantity = (type, product) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item._id === product._id) {
          let productDetails = item.selectedSize;
          let homeProductDetails = item;

          // if (!productDetails) {
          //   // Handle the case where productDetails is undefined
          //   return item;
          // }
          if (productDetails) {
            if (type === "inc") {
              // Ensure that productDetails.quantity exists and is a number
              if (typeof productDetails.quantity === "number") {
                productDetails.quantity += 1;
              } else {
                // If quantity is not a number, set it to 1
                productDetails.quantity = 1;
              }
            } else if (type === "dec" && productDetails.quantity > 1) {
              productDetails.quantity -= 1;
            }
          } else {
            if (type === "inc") {
              // Ensure that productDetails.quantity exists and is a number
              if (typeof homeProductDetails.quantity === "number") {
                homeProductDetails.quantity += 1;
              } else {
                // If quantity is not a number, set it to 1
                homeProductDetails.quantity = 1;
              }
            } else if (type === "dec" && homeProductDetails.quantity > 1) {
              homeProductDetails.quantity -= 1;
            }
          }
        }

        return item;
      });
    });
  };
  const handleSingleProductQuantity = (type, product) => {
    setSingleItems((prevItem) => {
      // Create a copy of the previous item to avoid mutating the state directly
      const newItem = { ...prevItem };

      if (newItem) {
        if (type === "inc") {
          if (typeof newItem.quantity == "number") {
            newItem.quantity += 1;
          } else {
            newItem.quantity = 1;
          }
        } else if (type === "dec" && newItem.quantity > 1) {
          newItem.quantity -= 1;
        }
      }
      

      return newItem;
    });
  };

  return (
    <Context.Provider
      value={{
        ourProduct,
        setOurProduct,
        quantity,
        setQuantity,
        productSize,
        setProductSize,
        selectProductData,
        setSelectProductData,
        toast,
        ToastContainer,
        products,
        setProducts,
        categories,
        setCategories,
        singleItems,
        setSingleItems,
        cartItems,
        setCartItems,
        cartCount,
        setCartCount,
        cartSubTotal,
        setCartSubTotal,
        handleAddToCart,
        handleAddToCartHome,
        handleRemoveFromCart,
        handleCartProductQuantity,
        setSingleProductSubTotal,
        singleProductSubTotal,
        handleBuyNow,
        handleSingleProductQuantity,
        totalSavedAmount,
        handleSingleCheckout,
        singleSubTotal,
        setSingleSubTotal,
        setSingleSavedAmount,
        singleSavedAmount,
        cartGrandTotal,
        singleGrandTotal,
        setSingleGrandTotal,
        cardDeliveryCharge,
        singleDeliveryCharge,
        setSingleDeliveryCharge,
        setCustomerDetail,
        customerDetail,
        swal,
        Swal,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppContext;
