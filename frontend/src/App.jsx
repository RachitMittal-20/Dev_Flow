import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { getDevelopers, getMonths } from "./api";
import Sidebar from "./components/Sidebar";

const ICView = lazy(() => import("./pages/ICView"));
const ManagerView = lazy(() => import("./pages/ManagerView"));
const ManagerDetailView = lazy(() => import("./pages/ManagerDetailView"));

function RouteFallback() {
  return (
    <div className="panel-surface flex min-h-[320px] items-center justify-center rounded-[24px] border border-[var(--border)]">
      <div className="space-y-3 text-center">
        <div className="skeleton mx-auto h-12 w-12 rounded-2xl bg-[rgba(255,255,255,0.08)]" />
        <p className="text-sm text-[var(--text-secondary)]">
          Loading view...
        </p>
      </div>
    </div>
  );
}

function DashboardShell() {
  const location = useLocation();
  const [developers, setDevelopers] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadInitialData() {
      setLoading(true);

      try {
        const [developerList, monthList] = await Promise.all([
          getDevelopers(),
          getMonths()
        ]);

        if (!isActive) {
          return;
        }

        setDevelopers(developerList);
        setMonths(monthList);
        setSelectedDeveloperId((current) =>
          developerList.some((developer) => developer.developer_id === current)
            ? current
            : developerList[0]?.developer_id || ""
        );
        setSelectedMonth((current) =>
          monthList.includes(current) ? current : monthList.at(-1) || ""
        );
        setError("");
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message || "Unable to load app data.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (developers.length === 0 || months.length === 0) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const developerFromSearch = searchParams.get("developer_id");
    const monthFromSearch = searchParams.get("month");

    if (
      developerFromSearch &&
      developers.some(
        (developer) => developer.developer_id === developerFromSearch
      )
    ) {
      setSelectedDeveloperId(developerFromSearch);
    }

    if (monthFromSearch && months.includes(monthFromSearch)) {
      setSelectedMonth(monthFromSearch);
    }
  }, [developers, location.search, months]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-4rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,142,247,0.18),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-[-6rem] right-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.16),transparent_72%)] blur-3xl" />
      </div>
      <div className="relative lg:flex">
        <Sidebar
          developers={developers}
          months={months}
          selectedDeveloperId={selectedDeveloperId}
          onSelectDeveloper={setSelectedDeveloperId}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          loading={loading}
          showDeveloperControls={location.pathname === "/"}
        />
        <main className="relative min-h-screen flex-1 px-4 pb-8 pt-4 lg:ml-[236px] lg:px-8 lg:pb-10 lg:pt-8">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <ICView
                    developers={developers}
                    selectedDeveloperId={selectedDeveloperId}
                    selectedMonth={selectedMonth}
                    shellLoading={loading}
                    shellError={error}
                  />
                }
              />
              <Route
                path="/manager"
                element={
                  <ManagerView
                    selectedMonth={selectedMonth}
                    onSelectMonth={setSelectedMonth}
                    months={months}
                    shellLoading={loading}
                    shellError={error}
                  />
                }
              />
              <Route
                path="/manager/:managerId"
                element={
                  <ManagerDetailView
                    selectedMonth={selectedMonth}
                    onSelectMonth={setSelectedMonth}
                    months={months}
                    shellLoading={loading}
                    shellError={error}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardShell />
    </BrowserRouter>
  );
}
