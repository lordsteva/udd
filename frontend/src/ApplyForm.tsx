import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { strucneSpreme } from "./utils/constants";

type Inputs = {
  ime: string;
  prezime: string;
  email: string;
  cv: string;
  sprema: string;
  pismo: string;
  adresa: string;
};
export default function ApplyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [applying, setApplying] = useState<any>(null);
  useEffect(() => {
    fetch("http://localhost:8080/api/log/");
  }, []);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    data.cv = data.cv[0];
    data.pismo = data.pismo[0];

    //@ts-ignore
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    setApplying("Indexing....");
    fetch("http://localhost:8080/api/cv/", {
      method: "post",
      body: formData,
    }).then(() => setApplying("DONE!"));
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
`;
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        margin: "auto",
        width: "min-content",
        border: "1px solid blue",
        marginTop: "5px",
        marginBottom: "5px",
      }}
    >
      <style>{css}</style>
      {/* register your input into the hook by invoking the "register" function */}
      <div className="wrapper">
        <div className="title">Ime:</div>
        <input {...register("ime", { required: true })} />
        {errors.ime && <div className="error">Ime je obavezno</div>}
      </div>
      <div className="wrapper">
        <div className="title">Prezime:</div>
        <input {...register("prezime", { required: true })} />
        {errors.prezime && <div className="error">Prezime je obavezno</div>}
      </div>
      <div className="wrapper">
        <div className="title">Email:</div>
        <input type="email" {...register("email", { required: true })} />{" "}
        {errors.email && <div className="error">Email je obavezan</div>}
      </div>
      <div className="wrapper">
        <div className="title">Adresa:</div>
        <input {...register("adresa", { required: true })} />
        {errors.adresa && <div className="error">Adresa je obavezna</div>}
      </div>
      <div className="wrapper">
        <div className="title">Stepn obrazovanja:</div>
        <select {...register("sprema", { required: true })}>
          {strucneSpreme.map((ss, id) => (
            <option key={id} value={id}>
              {ss}
            </option>
          ))}
        </select>
        {errors.sprema && (
          <div className="error">Stepen obrazovanja je obavezan</div>
        )}
      </div>
      <div className="wrapper">
        <div className="title">CV:</div>
        <input type="file" {...register("cv", { required: true })} />
        {errors.cv && <div className="error">CV je obavezan</div>}
      </div>
      <div className="wrapper">
        <div className="title">Propratno pismo:</div>
        <input type="file" {...register("pismo", { required: true })} />
        {errors.pismo && (
          <div className="error">Propratno pismo je obavezno</div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input type="submit" style={{ margin: "5px" }} value="Prijavi se" />
        <span style={{ display: "flex", alignItems: "center" }}>
          {applying}
        </span>
      </div>
    </form>
  );
}
