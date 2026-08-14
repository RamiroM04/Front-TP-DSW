import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">

      <Card className="w-full max-w-md p-6 md:p-10 shadow-lg">
        <CardHeader>
          <CardTitle>Bienvenido a GymPass</CardTitle>
          <CardDescription>Por favor, inicia sesión para continuar.</CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Correo</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@correo.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Olvidé mi contraseña
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                {/* <Button type="submit">Login</Button> */}
                {/* Por ahora, el botón de login redirige a la landing temporal */}
                <Button variant="default" type="button" onClick={() => window.location.href = '/project-overview'}>Ingresar</Button>
              </Field>
              {/* 
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
              */}
              <Field>
                <FieldDescription className="text-center">
                  Todavía no sos miembro? <a href="#">Conocé nuestros planes</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

      </Card>
    </div >
  )
}