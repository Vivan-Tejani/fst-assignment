import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form action={loginAction} className="w-80 space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-bold">Helpdesk Login</h1>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" required />
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">Login</Button>
        <p className="text-xs text-muted-foreground">
          Try: admin@helpdesk.dev / password123
        </p>
      </form>
    </div>
  );
}
