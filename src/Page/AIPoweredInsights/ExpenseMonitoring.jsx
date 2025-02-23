import { useEffect, useState,  useMemo } from 'react'; 
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AttachMoney, TrendingDown, TrendingUp, Category } from '@mui/icons-material';

const ExpenseMonitoring = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [highestExpense, setHighestExpense] = useState('');
  const [expensesVsRevenue, setExpensesVsRevenue] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  /* useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const expensesRes = await fetch('http://localhost:5000/api/expenses');
        const invoicesRes = await fetch('http://localhost:5000/api/sales');
        
        if (!expensesRes.ok || !invoicesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const expenses = await expensesRes.json();
        const invoices = await invoicesRes.json();

        // Calculate total expenses for the current month
        const currentMonth = new Date().getMonth() + 1;
        const totalExpensesThisMonth = expenses
          .filter((exp) => new Date(exp.paymentDate).getMonth() + 1 === currentMonth)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        setTotalExpenses(totalExpensesThisMonth);


        // Find highest expense category
        const categoryTotals = expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
          return acc;
        }, {});
        const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        );
        setHighestExpense(`${highestCategory} ($${categoryTotals[highestCategory].toFixed(2)})`);

        // Calculate Expenses vs Revenue Ratio
        const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.final_grand_total), 0);
        const expenseRatio = totalRevenue > 0 ? ((totalExpensesThisMonth / totalRevenue) * 100).toFixed(2) : 0;

        setExpensesVsRevenue(expenseRatio);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchExpensesData();
  }, []);  */

   // Fetch expenses and invoices concurrently
   useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const [expensesRes, invoicesRes] = await Promise.all([
          fetch('http://localhost:5000/api/expenses', { signal: controller.signal }),
          fetch('http://localhost:5000/api/sales', { signal: controller.signal }),
        ]);

        if (!expensesRes.ok || !invoicesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [expensesData, invoicesData] = await Promise.all([
          expensesRes.json(),
          invoicesRes.json(),
        ]);

        setExpenses(expensesData);
        setInvoices(invoicesData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching expense data:', err);
          setError(err.message);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // Compute total expenses for the current month
  useEffect(() => {
    if (!expenses.length) return;
    const currentMonth = new Date().getMonth() + 1;
    const totalThisMonth = expenses
      .filter((exp) => new Date(exp.paymentDate).getMonth() + 1 === currentMonth)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setTotalExpenses(totalThisMonth);
  }, [expenses]);

  // Compute highest expense category
  useEffect(() => {
    if (!expenses.length) return;
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});
    const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
    setHighestExpense(`${highestCategory} ($${categoryTotals[highestCategory].toFixed(2)})`);
  }, [expenses]);

  // Compute Expenses vs Revenue Ratio
  useEffect(() => {
    if (!expenses.length || !invoices.length) return;
    const currentMonth = new Date().getMonth() + 1;
    const totalExpensesThisMonth = expenses
      .filter((exp) => new Date(exp.paymentDate).getMonth() + 1 === currentMonth)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.final_grand_total), 0);
    const ratio = totalRevenue > 0 ? ((totalExpensesThisMonth / totalRevenue) * 100).toFixed(2) : 0;
    setExpensesVsRevenue(ratio);
  }, [expenses, invoices]);


   // Memoize the rendering of the card content to avoid unnecessary re-renders
   const content = useMemo(() => {
    return (
      <>
        {/* Total Expenses */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            <AttachMoney sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
            Total Expenses This Month:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            ${typeof totalExpenses === 'number' ? totalExpenses.toFixed(2) : '0.00'}
          </Typography>
        </Box>

        {/* Highest Expense */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            <Category sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
            Highest Expense:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {highestExpense}
          </Typography>
        </Box>

        {/* Expenses vs Revenue */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {expensesVsRevenue > 50 ? (
              <TrendingDown sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1, color: 'error.main' }} />
            ) : (
              <TrendingUp sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1, color: 'success.main' }} />
            )}
            Expenses vs Revenue Ratio:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {expensesVsRevenue}%
          </Typography>
        </Box>
      </>
    );
  }, [totalExpenses, highestExpense, expensesVsRevenue]);

  return (
    <Card sx={{ maxWidth: 345, boxShadow: 5, borderRadius: 3, bgcolor: 'background.paper', p: 2, mt: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', textTransform: 'uppercase' }}>
          <AttachMoney sx={{ fontSize: 22, verticalAlign: 'middle', mr: 1 }} /> Expense Monitoring Dashboard
        </Typography>
        {error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseMonitoring;