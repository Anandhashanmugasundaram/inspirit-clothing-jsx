// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import App from './App.jsx';
// import { AppProvider } from '@/context/AppContext';
// import './styles.css';
// import SmoothScroll from './components/site/SmoothScroll.jsx';

// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//        <SmoothScroll />
//         <AppProvider>
//           <App />
//           <Toaster position="top-center" toastOptions={{
//             style: { background: 'oklch(0.08 0.005 20)', color: 'oklch(0.985 0.003 60)', border: '1px solid oklch(1 0 0 / 12%)', borderRadius: '2px', padding: '14px 18px', fontFamily: 'Inter', letterSpacing: '0.05em' },
//           }} />
//         </AppProvider>
//       </BrowserRouter>
//     </QueryClientProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AppProvider } from '@/context/AppContext';
import ErrorBoundary from '@/components/site/ErrorBoundary';
import './styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProvider>
            {/* <App />
            <Toaster position="top-center" toastOptions={{
              style: { background: 'oklch(0.08 0.005 20)', color: 'oklch(0.985 0.003 60)', border: '1px solid oklch(1 0 0 / 12%)', borderRadius: '2px', padding: '14px 18px', fontFamily: 'Inter', letterSpacing: '0.05em' },
            }} /> */}
          </AppProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

