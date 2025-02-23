import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const OrderTable = ({ orders }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Grand Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.orderID}>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.currency} {Number(order.grandTotal).toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">No Orders Found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
