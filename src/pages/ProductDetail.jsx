import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await getProductDetail(id);

      console.log("DETAIL:", res.data);

      setProduct(res.data.data); // adjust if needed
    } catch (err) {
      console.log(err);
    }
  };

  if (!product) return <h2>Loading...</h2>;

  

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={product.image}
        width="250px"
        alt={product.name}
      />

      <h2>{product.name}</h2>
      <p>Price: ₹{product.price}</p>

      <p>{product.description}</p>

      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetail;