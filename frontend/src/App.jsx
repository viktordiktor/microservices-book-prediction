import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Sells from "./pages/Sells";
import Book from "./pages/Book";
import CreateForecast from "./pages/CreateForecast";
import Forecast from "./pages/Forecast";
import Forecasts from "./pages/Forecasts";
import About from "./pages/About";
import Orders from "./pages/Orders";
import Accounting from "./pages/Accounting";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/books" element={<Books/>}/>
                    <Route path="/sells" element={<Sells/>}/>
                    <Route path="/orders" element={<Orders/>}/>
                    <Route path="/books/:bookId" element={<Book/>}/>
                    <Route path="/forecasts" element={<Forecasts/>}/>
                    <Route path="/forecast/create" element={<CreateForecast/>}/>
                    <Route path="/forecast/:forecastId" element={<Forecast/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/accounting" element={<Accounting/>}/>
                </Routes>
            </Router>
        </QueryClientProvider>
    );
};

export default App;