import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

const OrderTable = ({ orders = [] }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Order ID</strong></TableCell>
            <TableCell><strong>Order Date</strong></TableCell>
            <TableCell><strong>Payment Status</strong></TableCell>
            <TableCell><strong>Order Status</strong></TableCell>
            <TableCell><strong>Total Amount</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.orderID}>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>{order.totalAmount}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Orders Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
