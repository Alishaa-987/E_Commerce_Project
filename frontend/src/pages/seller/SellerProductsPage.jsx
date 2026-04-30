import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import SellerDeleteConfirmModal from "../../components/seller/dashboard/SellerDeleteConfirmModal";
import SellerDashboardProductsPanel from "../../components/seller/dashboard/SellerDashboardProductsPanel";
import { deleteProduct } from "../../redux/actions/product";

const SellerProductsPage = () => {
  const { dashboardData } = useOutletContext();
  const dispatch = useDispatch();
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null);
  const {
    sellerProducts,
    sellerProductsError,
    deleteProductLoading,
    deletingProductId,
  } = useSelector((state) => state.products);
  const sellerId =
    (typeof window !== "undefined" && window.localStorage.getItem("sellerId")) ||
    dashboardData?.sellerShop?._id;

  const handleDeleteProduct = (productId, productName) => {
    setPendingDeleteProduct({
      id: productId,
      name: productName,
    });
  };

  const handleConfirmDeleteProduct = async () => {
    if (!sellerId || !pendingDeleteProduct?.id) {
      setPendingDeleteProduct(null);
      return;
    }

    const result = await dispatch(deleteProduct(pendingDeleteProduct.id, sellerId));

    if (result?.success) {
      setPendingDeleteProduct(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (deleteProductLoading) {
      return;
    }

    setPendingDeleteProduct(null);
  };

  return (
    <>
      <SellerDashboardProductsPanel
        sellerProducts={sellerProducts}
        error={sellerId ? sellerProductsError : "Seller account id is missing. Please log in again."}
        onDeleteProduct={handleDeleteProduct}
        isDeletingProduct={deleteProductLoading}
        deletingProductId={deletingProductId}
      />

      <SellerDeleteConfirmModal
        isOpen={Boolean(pendingDeleteProduct)}
        itemName={pendingDeleteProduct?.name || ""}
        itemType="product"
        isDeleting={deleteProductLoading}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteProduct}
      />
    </>
  );
};

export default SellerProductsPage;
