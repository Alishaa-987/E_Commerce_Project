import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SellerDeleteConfirmModal from "../../components/seller/dashboard/SellerDeleteConfirmModal";
import SellerDashboardEventsPanel from "../../components/seller/dashboard/SellerDashboardEventsPanel";
import { deleteEvent } from "../../redux/actions/event";

const SellerEventsPage = () => {
  const { dashboardData } = useOutletContext();
  const dispatch = useDispatch();
  const [pendingDeleteEvent, setPendingDeleteEvent] = useState(null);
  const {
    sellerEvents,
    sellerEventsError,
    deleteEventLoading,
    deletingEventId,
  } = useSelector((state) => state.events);
  const sellerId =
    (typeof window !== "undefined" && window.localStorage.getItem("sellerId")) ||
    dashboardData?.sellerShop?._id;

  const handleDeleteEvent = (eventId, eventName) => {
    setPendingDeleteEvent({
      id: eventId,
      name: eventName,
    });
  };

  const handleConfirmDeleteEvent = async () => {
    if (!sellerId || !pendingDeleteEvent?.id) {
      setPendingDeleteEvent(null);
      return;
    }

    const result = await dispatch(deleteEvent(pendingDeleteEvent.id, sellerId));

    if (result?.success) {
      setPendingDeleteEvent(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (deleteEventLoading) {
      return;
    }

    setPendingDeleteEvent(null);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-white/10 bg-[#111114] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
              All Events
            </p>
            <h2 className="mt-2 text-3xl font-Playfair font-semibold text-white">
              Campaign schedule
            </h2>
            <p className="mt-3 text-sm text-white/50">
              View your events in a full list and manage them one by one.
            </p>
          </div>
          <Link
            to="/seller/create-event"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0b0d] transition hover:-translate-y-0.5"
          >
            Create Event
          </Link>
        </div>
      </div>

      <SellerDashboardEventsPanel
        sellerEvents={sellerEvents}
        error={sellerId ? sellerEventsError : "Seller account id is missing. Please log in again."}
        onDeleteEvent={handleDeleteEvent}
        isDeletingEvent={deleteEventLoading}
        deletingEventId={deletingEventId}
      />

      <SellerDeleteConfirmModal
        isOpen={Boolean(pendingDeleteEvent)}
        itemName={pendingDeleteEvent?.name || ""}
        itemType="event"
        isDeleting={deleteEventLoading}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteEvent}
      />
    </div>
  );
};

export default SellerEventsPage;
