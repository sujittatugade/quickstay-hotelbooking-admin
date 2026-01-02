import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <div className="info-section">{children}</div>
      </div>
    </div>
  );
}
