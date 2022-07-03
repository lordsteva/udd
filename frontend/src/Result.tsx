import { strucneSpreme } from "./utils/constants";
export default function Result({ data, hl }: any) {
  const css = `
  em{
    font-weight:700;
  }
  .wrapper2 {
    display: block;
    padding:10px;
    margin:20px;
    border: 1px solid blue ;
    max-width: 700px;
  }
`;

  return (
    <div className="wrapper2">
      <style>{css}</style>
      <a href={`/cv/${data.id}`} target="_blank" style={{ fontSize: 20 }}>
        {data.ime} {data.prezime}
      </a>
      <div>Strucna sprema: {strucneSpreme[data.strucnaSprema]}</div>
      <div>Sazetak:</div>
      {hl && (
        <div className="wrapper2">
          {Object.keys(hl).map((k) => (
            <div key={k}>
              <div style={{ textDecoration: "underline" }}>{k}: </div>
              {hl[k].map((x: any) => (
                <div key={x} dangerouslySetInnerHTML={{ __html: x }}></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
