import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Result from "./Result";
import { mappings, strucneSpreme, style } from "./utils/constants";

type Inputs = {
  ime: string;
  prezime: string;

  stepenObrazovanjaMin: string;
  stepenObrazovanjaMax: string;
  pismo: string;
  operator: Record<string, string>;
};

export default function SearchForm() {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const query: any = { attributes: [], operators: [] };
    izabraneOpcije.forEach((o, i) => {
      query.attributes.push(o);
      if (o === "ime") {
        query.ime = data.ime;
        query.prezime = data.prezime;
      } else if (o === "sprema") {
        query.min = data.stepenObrazovanjaMin;
        query.max = data.stepenObrazovanjaMax;
      } else {
        query.pismo = data.pismo;
      }
      if (i > 0) {
        query.operators[i - 1] = data.operator[i - 1];
      }
    });

    const res = await fetch("http://localhost:8080/api/search/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
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
  const [opcije, setOpcije] = useState(["ime", "pismo", "sprema"]);
  const [izabraneOpcije, setIzabraneOpcije] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const render = (opcija: string, i: number) => {
    if (opcija === "ime") {
      return (
        <div className="wrapper" key={opcija}>
          <div className="title">Ime i prezime:</div>
          <input {...register("ime")} />
          <input style={{ marginLeft: 10 }} {...register("prezime")} />

          <span
            className="remove"
            onClick={() => {
              setIzabraneOpcije(izabraneOpcije.filter((o, idx) => i !== idx));
              setOpcije([...opcije, opcija]);
            }}
          >
            X
          </span>
        </div>
      );
    }
    if (opcija === "pismo") {
      return (
        <div className="wrapper" key={opcija}>
          <div className="title">Sadrzaj pisma:</div>
          <input {...register("pismo")} />
          <span
            className="remove"
            onClick={() => {
              setIzabraneOpcije(izabraneOpcije.filter((o, idx) => i !== idx));
              setOpcije([...opcije, opcija]);
            }}
          >
            X
          </span>
        </div>
      );
    }
    return (
      <div className="wrapper" style={{ position: "relative" }} key={opcija}>
        <div className="title">Stepn obrazovanja:</div>
        <div style={{ display: "flex", columnGap: "10px" }}>
          <select {...register("stepenObrazovanjaMin")}>
            {strucneSpreme.map((ss, id) => (
              <option key={id} value={id}>
                {ss}
              </option>
            ))}
          </select>
          -
          <select {...register("stepenObrazovanjaMax")}>
            {strucneSpreme.map((ss, id) => (
              <option key={id} value={id}>
                {ss}
              </option>
            ))}
          </select>{" "}
          <span
            className="remove"
            style={{ right: -30 }}
            onClick={() => {
              setIzabraneOpcije(izabraneOpcije.filter((o, idx) => i !== idx));
              setOpcije([...opcije, opcija]);
            }}
          >
            X
          </span>
        </div>
      </div>
    );
  };

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
      {!!opcije.length && (
        <div style={style}>
          <div style={{ fontSize: 20 }}>Dostupne opcije:</div>
          <div
            style={{
              display: "flex",
              paddingBottom: 10,
              paddingTop: 10,
              gap: 10,
              flexFlow: "column",
            }}
          >
            {opcije.map((opcija) => (
              <div style={{ display: "flex", gap: 10 }} key={opcija}>
                <span
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                    borderRadius: 20,
                    cursor: "pointer",
                    background: "green",
                    color: "white",
                  }}
                  onClick={() => {
                    setIzabraneOpcije([...izabraneOpcije, opcija]);
                    setOpcije(opcije.filter((o) => o !== opcija));
                  }}
                >
                  +
                </span>
                {/* @ts-ignore */}
                <span>{mappings[opcija]}</span>
              </div>
            ))}
          </div>{" "}
        </div>
      )}
      {!!izabraneOpcije.length && (
        <form onSubmit={handleSubmit(onSubmit)} style={style}>
          <div style={{ fontSize: 20 }}>Pretraga:</div>

          <style>{css}</style>
          {izabraneOpcije.map((o, i) => (
            <div key={i}>
              {render(o, i)}
              {izabraneOpcije.length > 1 && i !== izabraneOpcije.length - 1 && (
                <select className="wrapper" {...register(`operator.${i}`)}>
                  <option value="AND"> AND</option>
                  <option value="OR"> OR</option>
                </select>
              )}
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input type="submit" style={{ margin: "5px" }} value="Trazi" />
          </div>
        </form>
      )}
      {renderResults()}
    </div>
  );
}
