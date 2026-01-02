import React, { useState } from "react";
import "./AddRoom.css";
import { Button, MenuItem, TextField } from "@mui/material";
import api from "../../Config/api.js";

function AddRooms() {
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);

  const availableAmenities = [
    "Room Service",
    "Mountain View",
    "Pool Access",
    "Free Breakfast",
    "Free WiFi",
  ];

  const handleAmenities = (value) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    );
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    if (!roomType || !price || images.length === 0) {
      alert("Please fill all fields and upload at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append("roomType", roomType);
    formData.append("price", parseFloat(price));

    images.forEach((img) => {
      formData.append("images", img);
    });

    amenities.forEach((a) => {
      formData.append("amenities", a);
    });

    try {
      const res = await api.post("/rooms/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Room added:", res.data);
      alert("Room added successfully!");
      setRoomType("");
      setPrice("");
      setAmenities([]);
      setImages([]);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Check console for details.");
    }
  };

  return (
    <div className="add-rooms">
      <h2>Add Room</h2>
      <p>Fill in details carefully and accurately</p>

      <div className="room-images">
        <h3>Images</h3>
        <input type="file" multiple onChange={handleImageChange} />
      </div>

      <div className="room-info">
        <div className="room-type">
          <h3>Room Type</h3>
          <TextField
            select
            label="Select Room Type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            sx={{ width: 200 }}>
            <MenuItem value="Single Bed">Single Bed</MenuItem>
            <MenuItem value="Family Suite">Family Suite</MenuItem>
            <MenuItem value="Double Bed">Double Bed</MenuItem>
            <MenuItem value="Luxury Bed">Luxury Bed</MenuItem>
          </TextField>
        </div>
        <div className="room-price">
          <h3>Price/Night</h3>
          <TextField
            type="number"
            inputProps={{ min: 1 }}
            sx={{ width: 100 }}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="amenities">
        <h3>Amenities</h3>
        {availableAmenities.map((amenity, index) => (
          <div key={index} style={{ marginTop: 5 }}>
            <input
              type="checkbox"
              checked={amenities.includes(amenity)}
              onChange={() => handleAmenities(amenity)}
            />
            <label> {amenity}</label>
          </div>
        ))}
      </div>

      <Button
        sx={{
          backgroundColor: "blue",
          color: "antiquewhite",
          borderRadius: 5,
          width: 100,
          marginTop: 2,
        }}
        onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default AddRooms;
