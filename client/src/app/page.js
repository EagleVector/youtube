import React from "react";
import UploadForm from "./components/uploadForm";
import Room from "./pages/Room";

export default function Home() {
  return (
    <div>
      <UploadForm />
      <Room />
    </div>
  );
}
