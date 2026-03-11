import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

function RoleRoute({ role }: { role: "driver" | "customer" | "admin" }) {
  const { user } = useAuth()

  if (user?.role !== role) {
    const redirectPath =
      user?.role === "driver"
        ? "/driver"
        : user?.role === "customer"
          ? "/customer"
          : "/"
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export { RoleRoute }
