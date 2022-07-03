import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Result from "./Result";
import { style } from "./utils/constants";

type Inputs = {
  adresa: string;
  km: string;
};

export default function GeoForm() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [results, setResults] = useState<any>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await fetch("http://localhost:8080/api/search/geo/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newRes = await res.json();
    setResults(newRes);
  };
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
  .remove{
    margin-left: 10px;
    border-radius: 20px;
    background: red;
    padding-left: 5px;    
    padding-right: 5px;
    position:absolute;
    cursor:pointer;
  }
`;

  const renderResults = () => {
    if (results === null) return null;
    if (results.length === 0)
      return (
        <div
          style={{
            textAlign: "center",
          }}
        >
          Nema pogodaka
        </div>
      );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        {results.map((r: any) => (
          <Result key={r._source.id} data={r._source} hl={r?.highlight} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} style={style}>
        <div style={{ fontSize: 20 }}>Pretraga:</div>

        <style>{css}</style>
        <div className="wrapper">
          <div className="title">Grad:</div>
          <input {...register("adresa")} />
        </div>
        <div className="wrapper">
          <div className="title">Distanca [KM]:</div>
          <input {...register("km")} />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input type="submit" style={{ margin: "5px" }} value="Trazi" />
        </div>
      </form>{" "}
      {renderResults()}
    </div>
  );
}
