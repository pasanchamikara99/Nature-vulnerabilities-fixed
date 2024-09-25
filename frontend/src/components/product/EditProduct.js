import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import storage from "../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import validator from 'validator';  // Import validator.js

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8002/product/getOne/${id}`)
      .then((res) => {
        setProduct(res.data);
        setInitialValues(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // Initialize form values
  const setInitialValues = (product) => {
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setDescription(product.description);
    setCategory(product.category);
    setSubCategory(product.subCategory);
    setMfd(product.mfd);
    setExp(product.exp);
    setWeight(product.weight);
    setImageLink(product.imageLink);
  };

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mfd, setMfd] = useState('');
  const [exp, setExp] = useState('');
  const [weight, setWeight] = useState(0);
  const [imageLink, setImageLink] = useState('');

  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);

  // Image upload file change handle
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageLink(url);
        });
      }
    );
  };

  // Sanitize inputs
  const sanitizeInput = (input) => {
    return validator.escape(input); // Escape special characters to prevent XSS or injection attacks
  };

  // Update Product function with input sanitization
  function updateProduct(event) {
    event.preventDefault();

    // Sanitize and validate inputs before sending to the backend
    const updatedProduct = {
      name: sanitizeInput(name),
      description: sanitizeInput(description),
      price: validator.toFloat(price.toString()), // Ensure price is a float
      quantity: validator.toInt(quantity.toString()), // Ensure quantity is an integer
      category: sanitizeInput(category),
      subCategory: sanitizeInput(subCategory),
      mfd: validator.toDate(mfd), // Ensure valid date
      exp: validator.toDate(exp), // Ensure valid date
      weight: validator.toFloat(weight.toString()), // Ensure weight is a float
      imageLink: sanitizeInput(imageLink)
    };

    axios
      .patch(`http://localhost:8002/product/update/${id}`, updatedProduct)
      .then(() => {
        window.alert("Product Updated !");
        navigate('/allProducts');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div style={{ marginLeft: "10%", marginTop: "20px" }}>
      <br />
      <h3>Edit {product.name}</h3>
      <br />
      <div>
        <div className="row md-6">
          <div className="col-md-6">
            <label className="labels" style={{ float: "left" }}>
              Upload Image:
            </label>
            <input type="file" class="form-control" onChange={handleChange} />
            <div style={{ marginTop: "10px" }}>
              <button type="button" class="btn btn-secondary" onClick={handleUpload}>
                Upload
              </button>
              <p>{percent} "% done"</p>
            </div>
          </div>
        </div>

        <div className="row md-6">
          <div className="col-md-6">
            <label className="labels" style={{ float: "left" }}>Product Name</label>
            <input
              type="text"
              className="form-control"
              required
              defaultValue={product.name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>

        <div className="row md-6">
          <div className="col-md-6">
            <label className="labels" style={{ float: "left" }}>Description</label>
            <textarea
              type="text"
              className="form-control"
              required
              defaultValue={product.description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <br />

        <div className="row md-6">
          <div className="col-md-3">
            <label className="labels" style={{ float: "left" }}>Price (RS)</label>
            <input
              type="text"
              className="form-control"
              required
              defaultValue={product.price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="labels" style={{ float: "left" }}>Category</label>
            <input
              type="text"
              className="form-control"
              required
              defaultValue={product.category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>
        </div>

        <div className="row md-6">
          <div className="col-md-6">
            <label className="labels" style={{ float: "left" }}>Sub Category</label>
            <input
              type="text"
              className="form-control"
              required
              defaultValue={product.subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
            />
          </div>
        </div>

        <div className="row md-6">
          <div className="col-md-3">
            <label className="labels" style={{ float: "left" }}>Weight (g)</label>
            <input
              type="text"
              className="form-control"
              required
              defaultValue={product.weight}
              onChange={(event) => setWeight(event.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="labels" style={{ float: "left" }}>Quantity</label>
            <input
              type="text"
              className="form-control"
              required
              defaultValue={product.quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
        </div>

        <div className="row md-6">
          <div className="col-md-3">
            <label className="labels" style={{ float: "left" }}>Manufactured Date</label>
            <input
              type="date"
              className="form-control"
              required
              defaultValue={new Date(product.mfd).toISOString().split("T")[0]}
              onChange={(event) => setMfd(event.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="labels" style={{ float: "left" }}>Expiry Date</label>
            <input
              type="date"
              className="form-control"
              required
              defaultValue={new Date(product.exp).toISOString().split("T")[0]}
              onChange={(event) => setExp(event.target.value)}
            />
          </div>
        </div>

        <div className="row md-6" style={{ marginLeft: "1px", marginTop: "10px" }}>
          <button className="btn btn-warning" type="button" onClick={updateProduct}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
