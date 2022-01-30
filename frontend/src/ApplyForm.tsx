import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  ime: string;
  prezime: string;
  email: string;
  cv: string;
  stepenObrazovanja: string;
  pismo: string;
  adresa: string;
};
const strucneSpreme = [
  "I Stepen četiri razreda osnovne",
  "II Stepen - osnovna škola",
  "III Stepen - SSS srednja škola",
  "IV Stepen - SSS srednja škola",
  "V Stepen - VKV - SSS srednja škola",
  "VI Stepen - VŠS viša škola",
  "VII - 1 VSS visoka stručna sprema",
  "VI-1 Osnovne trogodišnje akademske studije",
  "VI-1 Osnovne trogodišnje strukovne studije",
  "VI-2 Specijalističke strukovne studije",
  "VII-1a Osnovne četvorogodišnje akademske studije",
  "VII-1a Integrisane master studije studije",
  "VII-1b Master",
  "VII-2 Magistar nauka",
  "VII-2 Specijalizacija u medicini",
  "VII-2 Specijalističke akademske studije",
  "VIII Doktor nauka",
];

export default function ApplyForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
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
        <select {...register("stepenObrazovanja", { required: true })}>
          {strucneSpreme.map((ss, id) => (
            <option key={id} value={id}>
              {ss}
            </option>
          ))}
        </select>
        {errors.stepenObrazovanja && (
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
      </div>
    </form>
  );
}
