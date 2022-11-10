import React, { FC, useState } from "react";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;
  const [amountOfBlocks, setAmountOfBlocks] = useState(3);

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <aside id="sidenav-open" className={styles.sidenav}>
          <div className={styles.sidenavContent}>
            {Array(amountOfBlocks)
              .fill(null)
              .map((item, index) => (
                <React.Fragment key={index}>
                  <h4>My</h4>
                  <a href="#">Dashboard</a>
                  <a href="#">Profile</a>
                  <a href="#">Preferences</a>
                  <a href="#">Archive</a>
                </React.Fragment>
              ))}
            <button
              onClick={() =>
                setAmountOfBlocks((currentAmount) => currentAmount + 1)
              }
            >
              Add block
            </button>
          </div>

          <a
            href="#"
            id="sidenav-close"
            title="Close Menu"
            aria-label="Close Menu"
          />
        </aside>
        <main className={styles.main}>
          <header>
            <a
              href="#sidenav-open"
              id="sidenav-button"
              className="hamburger"
              title="Open Menu"
              aria-label="Open Menu"
            >
              Open Sidenav
            </a>
            <h1>Site Title</h1>
          </header>

          <article>
            <h2>Totam Header</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>

            <h3>Subhead Totam Odit</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>

            <h3>Subhead</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>

            <h3>Subhead</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>

            <h3>Subhead</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              rerum, amet odio explicabo voluptas eos cum libero, ex esse quasi
              optio incidunt soluta eligendi labore error corrupti! Dolore,
              cupiditate porro.
            </p>
          </article>
        </main>
      </div>
      <footer>
        Footer1 <br />
        Footer1 <br />
        Footer1 <br />
        Footer1 <br />
        Footer1 <br />
        Footer1 <br />
        Footer1 <br />
        Footer1 <br />
      </footer>
    </div>
  );
};

export default SidenavLayout;
