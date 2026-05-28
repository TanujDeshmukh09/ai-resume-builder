import React from "react"
import { useNavigate } from "react-router-dom"

function SignInPage() {

  const navigate = useNavigate()

  React.useEffect(() => {
    navigate("/auth/customAuth")
  }, [])

  return null
}

export default SignInPage