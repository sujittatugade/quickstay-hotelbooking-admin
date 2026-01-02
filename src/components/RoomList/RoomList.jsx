import React, { useEffect, useState } from "react";
import api from "../../Config/api.js";
import "./RoomList.css";
import { Close, Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Switch, TextField, Button, MenuItem } from "@mui/material";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [updatedAmenity, setUpdatedAmenity] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deleteImageMode, setDeleteImageMode] = useState(false);

  useEffect(() => {
    api
      .get("/rooms/all")
      .then((res) => {
        console.log("ROOMS FROM API", res.data);
        setRooms(res.data);
      })
      .catch(() => toast.error("Failed to fetch rooms"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Room deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEdit = (room) => {
    setSelectedRoomId(room.id);
    setRoomType(room.roomType);
    setPrice(room.pricePerNight);
    setUpdatedAmenity(room.amenities?.map((a) => a.name) || []);
    setDeleteImageMode(false);
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("roomType", roomType);
    formData.append("price", price);

    updatedAmenity.forEach((a) => formData.append("amenities", a));
    newImages.forEach((img) => formData.append("images", img));

    try {
      const res = await api.put(`/rooms/update/${selectedRoomId}`, formData);

      setRooms((prev) =>
        prev.map((r) => (r.id === selectedRoomId ? { ...r, ...res.data } : r))
      );

      toast.success("Room updated");
      setSelectedRoomId(null);
      setNewImages([]);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleAvailability = async (roomId, value) => {
    try {
      await api.put(`/rooms/availability/${roomId}?isAvailable=${value}`);

      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, available: value } : r))
      );

      toast.success("Availability updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update availability");
    }
  };

  const handleDeleteSingleImage = async (imageId) => {
    try {
      await api.delete(`/roomImage/deleteImage/${imageId}`);

      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoomId
            ? {
                ...room,
                images: room.images.filter((img) => img.id !== imageId),
              }
            : room
        )
      );

      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="room-list">
      <h2>All Rooms</h2>

      {rooms.map((room) => (
        <div key={room.id} className="room-card">
          <div className="delete">
            <h2>{room.roomType}</h2>
            <div className="update">
              <Edit
                onClick={() => openEdit(room)}
                sx={{ cursor: "pointer", color: "blue" }}
              />
              <Delete
                onClick={() => handleDelete(room.id)}
                sx={{ cursor: "pointer", color: "red" }}
              />
            </div>
          </div>

          <p>
            <b>Price:</b> ₹{room.pricePerNight}
          </p>

          <p>
            <b>Amenities:</b>{" "}
            {room.amenities?.map((a) => a.name).join(", ") || "None"}
          </p>

          <div className="images-container">
            {room.images?.map((img) => (
              <img
                key={img.id}
                src={`data:image/jpeg;base64,${img.image}`}
                className="room-img"
                alt="room"
              />
            ))}
          </div>

          <div className="available">
            <span>Available</span>
            <Switch
              checked={room.available === true}
              onChange={(e) => handleAvailability(room.id, e.target.checked)}
            />
          </div>

          {selectedRoomId === room.id && (
            <div className="inline-edit-box">
              {!deleteImageMode ? (
                <>
                  <TextField
                    label="Room Type"
                    select
                    sx={{ mt: 2 }}
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    fullWidth>
                    <MenuItem value="Single Bed">Single Bed</MenuItem>
                    <MenuItem value="Family Suite">Family Suite</MenuItem>
                    <MenuItem value="Double Bed">Double Bed</MenuItem>
                    <MenuItem value="Luxury Bed">Luxury Bed</MenuItem>
                  </TextField>

                  <TextField
                    label="Price"
                    type="number"
                    sx={{ mt: 2 }}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                  />

                  <div className="amenities-box">
                    {[
                      "Free WiFi",
                      "Room Service",
                      "Mountain View",
                      "Free Breakfast",
                      "Pool Access",
                    ].map((a) => (
                      <label key={a}>
                        <input
                          type="checkbox"
                          checked={updatedAmenity.includes(a)}
                          onChange={() =>
                            setUpdatedAmenity((prev) =>
                              prev.includes(a)
                                ? prev.filter((x) => x !== a)
                                : [...prev, a]
                            )
                          }
                        />
                        {a}
                      </label>
                    ))}
                  </div>

                  <input type="file" multiple onChange={handleImageChange} />

                  <div className="edit-actions">
                    <Button onClick={() => setDeleteImageMode(true)}>
                      Delete Images
                    </Button>
                    <Button onClick={() => setSelectedRoomId(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate}>Update</Button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Delete Images</h3>
                  <div className="delete-img-grid">
                    {room.images?.map((img) => (
                      <div key={img.id} className="img-card">
                        <img
                          src={`data:image/jpeg;base64,${img.image}`}
                          alt="room"
                        />
                        <Close
                          className="close-icon"
                          onClick={() => handleDeleteSingleImage(img.id)}
                        />
                      </div>
                    ))}
                  </div>

                  <Button onClick={() => setDeleteImageMode(false)}>
                    Back
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RoomList;
