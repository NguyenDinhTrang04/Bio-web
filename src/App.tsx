import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BioPage from "./pages/bio/BioPage";
import LecturerDetailPage from "./pages/bio/LecturerDetailPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bio" element={<BioPage />} />
              <Route path="/bio/:id" element={<LecturerDetailPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </Router>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
