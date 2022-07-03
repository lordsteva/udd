import ApplyForm from "./ApplyForm";
import CV from "./CV";
import GeoForm from "./GeoForm";
import SearchForm from "./SearchForm";

function App() {
  if (window.location.pathname === "/apply") return <ApplyForm />;
  if (window.location.pathname === "/search") return <SearchForm />;
  if (window.location.pathname === "/geo") return <GeoForm />;
  if (window.location.pathname.includes("cv")) return <CV />;
  if (window.location.pathname === "/stat")
    return (
      <div style={{ display: "flex", justifyItems: "center", gap: 10 }}>
        <iframe
          src="http://localhost:5601/app/kibana#/visualize/edit/d2811b50-fad4-11ec-b80e-e9bb2efe8438?embed=true&_g=(filters%3A!())"
          height="600"
          width="800"
        ></iframe>
        <iframe
          src="http://localhost:5601/app/kibana#/visualize/edit/383ac870-fad4-11ec-b80e-e9bb2efe8438?embed=true&_g=(filters%3A!())"
          height="600"
          width="800"
        ></iframe>
      </div>
    );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        margin: 20,
        gap: 20,
      }}
    >
      <style>{`
      .link{
        border: 1px black solid;
        padding: 5px;
        background: lightgray;
        color: blue;
        text-decoration: none;
      }
      `}</style>
      <a className="link" href="/stat">
        Statistika
      </a>
      <a className="link" href="/search">
        Pretraga
      </a>
      <a className="link" href="/geo">
        Geo Pretraga
      </a>
      <a className="link" href="/apply">
        Prijava
      </a>
    </div>
  );
}

export default App;
