import React, { useState } from "react";
import Layout from "./dashboard/Layout";
import AuthForm from "./AuthForm";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  const [user, setUser] = useState(null);

  return (
    <ErrorBoundary>
      {user ? (
        <Layout user={user}>
          <h2>Welcome to BillingApp</h2>
          <p>Manage your invoices and sales easily.</p>
        </Layout>
      ) : (
        <AuthForm onAuthSuccess={setUser} />
      )}
    </ErrorBoundary>
  );
}

export default App;
