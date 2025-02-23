// Section2.js
import React, { useState } from "react";
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore, Warning as WarningIcon, AccessTime as TimeIcon, MonetizationOn as MoneyIcon } from "@mui/icons-material";

const ExpandableCard = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card sx={{ padding: 2, marginBottom: 2, borderRadius: 2, boxShadow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Box>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
};

const Section2 = ({ topSuppliers, supplierIssues, recentSuppliers, pendingPayments }) => {
  return (
    <Box>
      {/* Top Suppliers by Transactions */}
      <ExpandableCard title="🏆 Top Suppliers by Transactions">
        <List>
          {topSuppliers.map((supplier, index) => (
            <ListItem key={supplier.supplier_id}>
              <ListItemText
                primary={`${index + 1}. ${supplier.name} (${supplier.category})`}
                secondary={`Transactions: ${supplier.transactions}`}
              />
            </ListItem>
          ))}
        </List>
      </ExpandableCard>

      {/* Supplier Alerts & Issues */}
      <ExpandableCard title="⚠️ Supplier Alerts & Issues">
        {supplierIssues.length > 0 ? (
          <List>
            {supplierIssues.map((supplier) => (
              <ListItem key={supplier.supplier_id}>
                <WarningIcon color="error" sx={{ marginRight: 1 }} />
                <ListItemText
                  primary={supplier.name}
                  secondary={`Issue: ${supplier.issue}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No issues found.</Typography>
        )}
      </ExpandableCard>

      {/* Recently Added Suppliers */}
      <ExpandableCard title="📅 Recently Added Suppliers">
        <List>
          {recentSuppliers.map((supplier) => (
            <ListItem key={supplier.supplier_id}>
              <TimeIcon color="primary" sx={{ marginRight: 1 }} />
              <ListItemText
                primary={supplier.name}
                secondary={`Added on: ${supplier.addedDate}`}
              />
            </ListItem>
          ))}
        </List>
      </ExpandableCard>

      {/* Payment & Due Invoices */}
      <ExpandableCard title="💰 Payment & Due Invoices">
        {pendingPayments.length > 0 ? (
          <List>
            {pendingPayments.map((supplier) => (
              <ListItem key={supplier.supplier_id}>
                <MoneyIcon color="success" sx={{ marginRight: 1 }} />
                <ListItemText
                  primary={supplier.name}
                  secondary={`Pending: ₹${supplier.pendingPayment} (Due by: ${supplier.dueDate})`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No pending payments.</Typography>
        )}
      </ExpandableCard>
    </Box>
  );
};

export default Section2;
