import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import EventIcon from "@mui/icons-material/Event";
import { CurrencyBitcoin, Delete } from "@mui/icons-material";
import api from "../../Config/api.js";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const totalRevenue = bookings.reduce(
    (sum, b) =>
      b.status === "PAID" ? sum + (b.room?.pricePerNight || 0) : sum,
    0
  );
  useEffect(() => {
    const fetchBookingsWithRooms = async () => {
      try {
        const bookingRes = await api.get("/bookings/allBookings");

        const bookingsWithRooms = await Promise.all(
          bookingRes.data.map(async (booking) => {
            const roomRes = await api.get(`/rooms/${booking.roomId}`);

            return {
              ...booking,
              room: roomRes.data,
            };
          })
        );

        setBookings(bookingsWithRooms);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchBookingsWithRooms();
  }, []);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/update-status/${bookingId}`, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/delete-booking/${bookingId}`);
      toast.success("Canceled Booking Deleted");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="dashboard">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <h1 style={{ fontSize: 30 }}>Dashboard</h1>
      <div className="bookings-revenue">
        <div className="booking">
          <EventIcon style={{ height: 50, width: 50 }} />
          <div className="total-booking">
            <span>Total Bookings</span>
            <span style={{ color: "gray" }}>{bookings.length}</span>
          </div>
        </div>

        <div className="booking">
          <CurrencyBitcoin style={{ height: 50, width: 50 }} />
          <div className="total-booking">
            <span>Total Revenue</span>
            <span style={{ color: "gray" }}>{totalRevenue}</span>
          </div>
        </div>
      </div>
      <div className="recent-booking-table">
        <h2>Recent Bookings</h2>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Room Type</th>
                <th>Price</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user.fullName}</td>
                  <td>{booking.room?.roomType}</td>
                  <td>₹ {booking.room?.pricePerNight}</td>
                  <td>
                    {booking.status !== "CANCELED" ? (
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          updateStatus(booking.id, e.target.value)
                        }
                        disabled={booking.status === "CANCELED"}
                        className={
                          booking.status === "PAID"
                            ? "status-completed"
                            : booking.status === "CANCELED"
                            ? "status-canceled"
                            : "status-pending"
                        }>
                        <option value="PAID">Paid</option>

                        <option
                          value="UNPAID"
                          disabled={booking.status === "PAID"}>
                          Unpaid
                        </option>
                      </select>
                    ) : (
                      <div className="canceled">
                        <span>Canceled</span>
                        <Delete
                          onClick={() => handleDeleteBooking(booking.id)}
                          sx={{ color: "red", cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
