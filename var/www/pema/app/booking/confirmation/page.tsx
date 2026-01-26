import { Suspense } from "react";
import ConfirmationScreen from "./Confirmation";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationScreen />
    </Suspense>
  )
}
