import { useEffect, useState } from "react";
import { strucneSpreme } from "./utils/constants";

export default function CV() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(
      `http://localhost:8080/api/view/${window.location.href.split("/").at(-1)}`
    )
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);
  const css = `
  .wrapper {
      display: block;
    margin:20px;
  }
  .title{
      padding-bottom:5px;
  }
  .error{
      color:red;
      font-size:12px;
  }
`;
  if (!data) return <div>Loading.....</div>;
  return (
    <div
      style={{
        width: 700,
        border: "1px solid blue",
        padding: 20,
        margin: "auto",
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <style>{css}</style>
      <div className="wrapper">
        <div className="title">Ime:</div>
        <div className="">{data.ime}</div>
      </div>
      <div className="wrapper">
        <div className="title">Prezime:</div>
        <div className="">{data.prezime}</div>
      </div>
      <div className="wrapper">
        <div className="title">Email:</div>
        <div className="">{data.email}</div>
      </div>
      <div className="wrapper">
        <div className="title">Adresa:</div>
        <div className="">{data.adresa}</div>
      </div>
      <div className="wrapper">
        <div className="title">Strucna sprema:</div>
        <div className="">{strucneSpreme[data.strucnaSprema]}</div>
      </div>

      <div className="wrapper">
        <a
          style={{
            padding: 10,
            paddingLeft: 30,
            paddingRight: 30,
            background: "lime",
            color: "white",
            fontWeight: 700,
          }}
          target="_blank"
          href={`http://localhost:8080/api/download/${data.cv}`}
        >
          CV
        </a>
      </div>
      <div className="wrapper" style={{ marginTop: 30 }}>
        <a
          style={{
            marginTop: 50,
            padding: 10,
            paddingLeft: 30,
            paddingRight: 30,
            background: "lime",
            color: "white",
            fontWeight: 700,
          }}
          target="_blank"
          href={`http://localhost:8080/api/download/${data.pismo}`}
        >
          Pismo
        </a>
      </div>
    </div>
  );
}
