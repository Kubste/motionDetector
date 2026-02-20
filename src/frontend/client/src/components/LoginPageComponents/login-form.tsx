import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import api from "@/components/UniversalComponents/api";
import ForgotPasswordWindow from "@/components/LoginPageComponents/ForgotPasswordWindow";
import {Spinner} from "@/components/ui/spinner";
import {useTranslation} from "react-i18next";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // preventing user to go back to login page after successful login
  useEffect(() => {
    api.get("/auth/is-logged").then(() => {navigate("/", {replace: true});})
  }, [navigate]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login/', { username, password });

      localStorage.setItem('username', response.data.username);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('role', response.data.role);
      navigate('/', {replace: true});
    } catch (error) {
      if(error.response && error.response.status === 400) setError(t("invalidNameOrPassword"));
      else setError("Server Error. Please try again.");

    } finally {
      setLoading(false);
    }
  }

  const handleClosePasswordChange = (event) => {
    setShowPasswordChange(false);
  }

  // @ts-ignore
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-gradient-to-br from-emerald-200/20 via-sky-200/30 to-amber-100/10 dark:from-blue-950/30 dark:via-slate-950/30 dark:to-violet-950/30">
        <CardHeader>
          <CardTitle>{t("loginTitle")}</CardTitle>
          <CardDescription>
            {t("loginDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">{t("username")}</FieldLabel>
                <Input
                  aria-invalid={!!error}
                  id="username"
                  type="text"
                  placeholder={t("username")}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                  <a
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:cursor-pointer"
                    onClick={() => setShowPasswordChange(true)}
                  >
                    {t("forgotPassword")}
                  </a>
                </div>
                <Input
                    aria-invalid={!!error}
                    id="password"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                    required />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? t("loginInProgress") : t("login")}
                  {loading && <Spinner/>}</Button>
              </Field>
            </FieldGroup>
            {/*{error && <p className="text-red-600 text-center font-medium mt-2">{error}</p>}*/}
            {error && <CardDescription className="mt-3 text-center text-red-600 hover:cursor-pointer hover:underline"
                                       onClick={() => setError(null)}>
                {error}
              </CardDescription>}
          </form>
        </CardContent>
      </Card>
      {showPasswordChange && <ForgotPasswordWindow onClose={handleClosePasswordChange}></ForgotPasswordWindow>}
    </div>
  )
}
