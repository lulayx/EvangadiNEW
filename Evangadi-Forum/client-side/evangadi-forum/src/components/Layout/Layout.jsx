// import React from "react";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
// import "./Layout.css"; // Import the CSS file

// function Layout({ children }) {
//   return (
//     <div className="layout-container">
//       <Header />
//       <main className="main-content">{children}</main>
//       <Footer />
//     </div>
//   );
// }

// export default Layout;
import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.css"; // Import CSS module

function Layout({ children }) {
  return (
    <div className={styles["layout-containers"]}>
      <Header />
      <main className={styles["main-contents"]}>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
